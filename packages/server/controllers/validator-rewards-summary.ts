import { Request, Response } from 'express';
import { pgClient, pgListener } from '../config/db';

export const getEpochsStatistics = async (req: Request, res: Response) => {

    try {

        const { page = 0, limit = 10 } = req.query;

        const skip = Number(page) * Number(limit);

        const [ epochsStats, blocksStats ] =
         await Promise.all([
            pgClient.query(`
                SELECT f_epoch, f_slot, f_num_att_vals, f_num_vals, 
                f_att_effective_balance_eth, f_total_effective_balance_eth,
                f_missing_source, f_missing_target, f_missing_head
                FROM t_epoch_metrics_summary
                ORDER BY f_epoch DESC
                OFFSET ${skip}
                LIMIT ${Number(limit)}
            `),
            pgClient.query(`
                SELECT (f_proposer_slot/32) AS epoch, 
                ARRAY_AGG(CASE WHEN f_proposed = true THEN 1 ELSE 0 END ORDER BY f_proposer_slot ASC) AS proposed_blocks
                FROM t_proposer_duties
                GROUP BY epoch
                ORDER BY epoch DESC
                OFFSET ${skip}
                LIMIT ${Number(limit)}
            `)
        ]);

        let arrayEpochs = [];

        epochsStats.rows.forEach((epoch: any) => { 
            const aux = blocksStats.rows.find((blocks: any) => blocks.epoch === epoch.f_epoch);
            arrayEpochs.push({  
                ...epoch, 
                ...aux,
            });
        });    
        
        res.json({
            epochsStats: arrayEpochs
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server'
        });
    }
};

export const getBlocks = async (req: Request, res: Response) => {

    try {

        const { page = 0, limit = 128 } = req.query;

        const skip = Number(page) * Number(limit);

        if (Number(page) > 0) {

            const blocks = await pgClient.query(`
                SELECT (f_proposer_slot/32) AS f_epoch, f_proposer_slot AS f_slot, f_proposed, t_eth2_pubkeys.f_pool_name,
                t_proposer_duties.f_val_idx AS f_proposer_index
                FROM t_proposer_duties
                LEFT OUTER JOIN t_eth2_pubkeys ON t_proposer_duties.f_val_idx = t_eth2_pubkeys.f_val_idx
                ORDER BY f_proposer_slot DESC
                OFFSET ${skip}
                LIMIT ${Number(limit)}
            `);

            res.json({
                blocks: blocks.rows
            });

        } else {

            const [actualBlocks, finalBlocks] = await Promise.all([
                pgClient.query(`
                    SELECT (f_proposer_slot/32) AS f_epoch, f_proposer_slot AS f_slot, f_proposed, t_eth2_pubkeys.f_pool_name,
                    t_proposer_duties.f_val_idx AS f_proposer_index
                    FROM t_proposer_duties
                    LEFT OUTER JOIN t_eth2_pubkeys ON t_proposer_duties.f_val_idx = t_eth2_pubkeys.f_val_idx
                    ORDER BY f_proposer_slot DESC
                    OFFSET ${skip}
                    LIMIT ${Number(limit)}
                `),
                pgClient.query(`
                    SELECT t_block_metrics.f_epoch, t_block_metrics.f_slot, t_eth2_pubkeys.f_pool_name, t_block_metrics.f_proposed, t_block_metrics.f_proposer_index,
                    t_block_metrics.f_graffiti
                    FROM t_block_metrics
                    LEFT OUTER JOIN t_eth2_pubkeys ON t_block_metrics.f_proposer_index = t_eth2_pubkeys.f_val_idx
                    WHERE t_block_metrics.f_epoch IN (
                        SELECT DISTINCT(f_epoch)
                        FROM t_block_metrics
                        ORDER BY f_epoch DESC
                        LIMIT 2
                    )
                    ORDER BY f_slot DESC
                `)
            ])
        
            let arrayEpochs: any[] = [...actualBlocks.rows, ...finalBlocks.rows];
            
            res.json({
                blocks: arrayEpochs
            });
    
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server'
        });
    }
};

export const getBlocksByGraffiti = async (req: Request, res: Response) => {

    try {
        const { page = 0, limit = 10 } = req.query;

        const skip = Number(page) * Number(limit);
        
        const { id } = req.params;

        const blocks = 
            await pgClient.query(`
                SELECT t_block_metrics.*, t_eth2_pubkeys.f_pool_name
                FROM t_block_metrics
                LEFT OUTER JOIN t_eth2_pubkeys ON t_block_metrics.f_proposer_index = t_eth2_pubkeys.f_val_idx
                WHERE f_graffiti LIKE '%${id}%'
                ORDER BY f_slot DESC
                OFFSET ${skip}
                LIMIT ${Number(limit)}
            `);

        res.json({
            blocks: blocks.rows,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server'
        });
    }
};

export const getBlockById = async (req: Request, res: Response) => {

    try {

        const { id } = req.params;

        const [ block, proposerDuties, withdrawals ] = 
            await Promise.all([
                pgClient.query(`
                    SELECT t_block_metrics.*, t_eth2_pubkeys.f_pool_name
                    FROM t_block_metrics
                    LEFT OUTER JOIN t_eth2_pubkeys ON t_block_metrics.f_proposer_index = t_eth2_pubkeys.f_val_idx
                    WHERE f_slot = '${id}'
                `),
                pgClient.query(`
                    SELECT f_proposed
                    FROM t_proposer_duties
                    WHERE f_proposer_slot = '${id}'
                `),
                pgClient.query(`
                    SELECT f_val_idx, f_address, f_amount
                    FROM t_withdrawals
                    WHERE f_slot = '${id}'
                `),                
            ]);

        if (block.rows[0]) {
            if (proposerDuties.rows.length > 0) {
                block.rows[0].f_proposed = proposerDuties.rows[0].f_proposed;
            }
    
            res.json({
                block: {
                    ...block.rows[0],
                    withdrawals: withdrawals.rows,
                },
            });
        } else {
            res.json({});
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server'
        });
    }
};

export const getEpoch = async (req: Request, res: Response) => {

    try {

        const { id } = req.params;

        const [ epochStats, blocksProposed, slotsEpoch, withdrawals ] = 
            await Promise.all([
                pgClient.query(`
                    SELECT f_epoch, f_slot, f_num_att_vals, f_num_vals, 
                    f_att_effective_balance_eth, f_total_effective_balance_eth,
                    f_missing_source, f_missing_target, f_missing_head
                    FROM t_epoch_metrics_summary
                    WHERE f_epoch = '${id}'
                `),
                pgClient.query(`
                    SELECT COUNT(*) AS proposed_blocks
                    FROM t_proposer_duties
                    WHERE f_proposer_slot/32 = '${id}' AND f_proposed = true
                `),
                pgClient.query(`
                    SELECT t_proposer_duties.*, t_eth2_pubkeys.f_pool_name
                    FROM t_proposer_duties
                    LEFT OUTER JOIN t_eth2_pubkeys ON t_proposer_duties.f_val_idx = t_eth2_pubkeys.f_val_idx
                    WHERE f_proposer_slot/32 = '${id}'
                    ORDER BY f_proposer_slot DESC
                `),
                pgClient.query(`
                    SELECT f_slot, f_amount
                    FROM t_withdrawals
                    WHERE f_slot/32 = '${id}'
                `)
            ]);

        const f_slots = slotsEpoch.rows.map((slot: any) => {
            return {
                ...slot,
                withdrawals: 
                    withdrawals.rows
                        .filter((withdrawal: any) => withdrawal.f_slot === slot.f_proposer_slot)
                        .reduce((acc: number, withdrawal: any) => acc + Number(withdrawal.f_amount), 0),
            };
        });

        let sumWithdrawals = 0;
        withdrawals.rows.forEach((withdrawal: any) => {
            sumWithdrawals += Number(withdrawal.f_amount);
        });

        res.json({
            epoch: {
                ...epochStats.rows[0],
                ...blocksProposed.rows[0], 
                f_slots,
                withdrawals: sumWithdrawals
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server'
        });
    }
};

export const getValidator = async (req: Request, res: Response) => {

    try {

        const { id } = req.params;

        const [ validatorStats, blocksProposed, validatorPerformance, withdrawals ] = 
            await Promise.all([
                pgClient.query(`
                SELECT 
                    t_validator_last_status.f_val_idx,
                    t_validator_last_status.f_epoch,
                    t_validator_last_status.f_balance_eth,
                    t_eth2_pubkeys.f_pool_name,
                    t_status.f_status
                FROM 
                    t_validator_last_status
                LEFT OUTER JOIN 
                    t_eth2_pubkeys ON t_validator_last_status.f_val_idx = t_eth2_pubkeys.f_val_idx
                LEFT OUTER JOIN
                    t_status ON t_validator_last_status.f_status = t_status.f_id
                WHERE 
                    t_validator_last_status.f_val_idx = '${id}'
                `),
                pgClient.query(`
                    SELECT t_proposer_duties.*, t_eth2_pubkeys.f_pool_name
                    FROM t_proposer_duties
                    LEFT OUTER JOIN t_eth2_pubkeys ON t_proposer_duties.f_val_idx = t_eth2_pubkeys.f_val_idx
                    WHERE t_proposer_duties.f_val_idx = '${id}'
                `),
                pgClient.query(`
                    SELECT 
                        SUM(CASE WHEN f_status IN (1, 3) AND (t_proposer_duties.f_proposed IS NULL OR t_proposer_duties.f_proposed = FALSE) THEN f_reward ELSE 0 END) as aggregated_rewards,
                        SUM(CASE WHEN f_status IN (1, 3) AND (t_proposer_duties.f_proposed IS NULL OR t_proposer_duties.f_proposed = FALSE) THEN f_max_reward ELSE 0 END) as aggregated_max_rewards,
                        COUNT(CASE WHEN f_in_sync_committee = TRUE THEN 1 ELSE null END) as count_sync_committee,
                        COUNT(CASE WHEN f_missing_source = TRUE THEN 1 ELSE null END) as count_missing_source,
                        COUNT(CASE WHEN f_missing_target = TRUE THEN 1 ELSE null END) as count_missing_target,
                        COUNT(CASE WHEN f_missing_head = TRUE THEN 1 ELSE null END) as count_missing_head,
                        COUNT(*) as count_attestations,
                        (
                            SELECT COUNT(CASE WHEN t_proposer_duties.f_proposed = TRUE THEN 1 ELSE null END)
                            FROM t_proposer_duties
                            WHERE t_proposer_duties.f_val_idx = '${id}'
                                AND t_proposer_duties.f_proposer_slot/32 BETWEEN MIN(t_validator_rewards_summary.f_epoch) AND MAX(t_validator_rewards_summary.f_epoch)
                        ) as proposed_blocks_performance,
                        (
                            SELECT COUNT(CASE WHEN t_proposer_duties.f_proposed = FALSE THEN 1 ELSE null END)
                            FROM t_proposer_duties
                            WHERE t_proposer_duties.f_val_idx = '${id}'
                                AND t_proposer_duties.f_proposer_slot/32 BETWEEN MIN(t_validator_rewards_summary.f_epoch) AND MAX(t_validator_rewards_summary.f_epoch)
                        ) as missed_blocks_performance
                    FROM t_validator_rewards_summary
                    LEFT JOIN t_proposer_duties 
                        ON t_validator_rewards_summary.f_val_idx = t_proposer_duties.f_val_idx 
                        AND t_validator_rewards_summary.f_epoch = t_proposer_duties.f_proposer_slot/32
                    WHERE t_validator_rewards_summary.f_val_idx = '${id}'
                    GROUP BY t_validator_rewards_summary.f_val_idx;
                `),
                pgClient.query(`
                    SELECT f_val_idx, f_slot/32 as f_epoch, f_slot, f_address, f_amount
                    FROM t_withdrawals
                    WHERE f_val_idx = '${id}'
                    ORDER BY f_slot DESC
                `)
            ]);

            const validator = {...validatorStats.rows[0], proposed_blocks: blocksProposed.rows, ...validatorPerformance.rows[0], withdrawals: withdrawals.rows}

        res.json({
            validator
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server'
        });
    }
};

export const getEntity = async (req: Request, res: Response) => {

    try {

        const { name } = req.params;

        const [ entityStats, blocksProposed, existsEntity ] = 
            await Promise.all([
                pgClient.query(`
                SELECT sum(f_balance_eth) as aggregate_balance, 
                    COUNT(CASE  f_status WHEN 0 THEN 1 ELSE null END) AS deposited,
                    COUNT(CASE  f_status WHEN 1 THEN 1 ELSE null END) AS active,
                    COUNT(CASE  f_status WHEN 2 THEN 1 ELSE null END) AS exited,
                    COUNT(CASE  f_status WHEN 3 THEN 1 ELSE null END) AS slashed
                FROM 
                    t_validator_last_status
                LEFT OUTER JOIN 
                    t_eth2_pubkeys ON t_validator_last_status.f_val_idx = t_eth2_pubkeys.f_val_idx
                WHERE 
                    f_pool_name = '${name}'
                `),
                pgClient.query(`
                    SELECT 
                        COUNT(CASE  f_proposed WHEN true THEN 1 ELSE null END) AS f_proposed,
                        COUNT(CASE  f_proposed WHEN false THEN 1 ELSE null END) AS f_missed
                    FROM
                        t_proposer_duties
                    LEFT OUTER JOIN 
                        t_eth2_pubkeys ON t_proposer_duties.f_val_idx = t_eth2_pubkeys.f_val_idx
                    WHERE 
                        f_pool_name = '${name}'
                `),
                pgClient.query(`
                    SELECT f_pool_name
                    FROM t_eth2_pubkeys
                    WHERE f_pool_name = '${name}'
                `)
            ]);

        if (existsEntity.rows.length === 0) {
            res.json({
                entity: null
            });
        } else {
            res.json({
                entity: {
                    ...entityStats.rows[0],
                    proposed_blocks: blocksProposed.rows[0]
                }
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server'
        });
    }
};

export const listenBlockNotification = async (req: Request, res: Response) => {

    try {

        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });

        pgListener.once('new_head', msg => {
            res.write('event: new_block\n');
            res.write(`data: ${msg.payload}`);
            res.write('\n\n');
            res.end();
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server'
        });
    }
};

export const listenEpochNotification = async (req: Request, res: Response) => {

    try {

        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });

        pgListener.once('new_epoch_finalized', msg => {
            res.write('event: new_epoch\n');
            res.write(`data: ${msg.payload}`);
            res.write('\n\n');
            res.end();
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server'
        });
    }
};

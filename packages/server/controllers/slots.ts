import { Request, Response } from 'express';
import { pgPools, pgListeners } from '../config/db';

export const getSlots = async (req: Request, res: Response) => {

    try {

        const { network, page = 0, limit = 128 } = req.query;

        const pgPool = pgPools[network as string];

        const skip = Number(page) * Number(limit);

        const [ slotsEpoch, withdrawals ] = 
            await Promise.all([
                pgPool.query(`
                    SELECT t_proposer_duties.*, t_eth2_pubkeys.f_pool_name
                    FROM t_proposer_duties
                    LEFT OUTER JOIN t_eth2_pubkeys ON t_proposer_duties.f_val_idx = t_eth2_pubkeys.f_val_idx
                    ORDER BY f_proposer_slot DESC
                    OFFSET ${skip}
                    LIMIT ${Number(limit)}
                `),
                pgPool.query(`
                    SELECT f_slot, f_amount
                    FROM t_withdrawals
                    OFFSET ${skip}
                    LIMIT ${Number(limit)}
                `)
            ]);

        const slots = slotsEpoch.rows.map((slot: any) => ({
            ...slot,
            withdrawals: 
                withdrawals.rows
                    .filter((withdrawal: any) => withdrawal.f_slot === slot.f_proposer_slot)
                    .reduce((acc: number, withdrawal: any) => acc + Number(withdrawal.f_amount), 0),
        }));

        res.json({
            slots
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

        const { network, page = 0, limit = 128 } = req.query;

        const pgPool = pgPools[network as string];

        const skip = Number(page) * Number(limit);

        if (Number(page) > 0) {

            const blocks = await pgPool.query(`
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
                pgPool.query(`
                    SELECT (f_proposer_slot/32) AS f_epoch, f_proposer_slot AS f_slot, f_proposed, t_eth2_pubkeys.f_pool_name,
                    t_proposer_duties.f_val_idx AS f_proposer_index
                    FROM t_proposer_duties
                    LEFT OUTER JOIN t_eth2_pubkeys ON t_proposer_duties.f_val_idx = t_eth2_pubkeys.f_val_idx
                    ORDER BY f_proposer_slot DESC
                    OFFSET ${skip}
                    LIMIT ${Number(limit)}
                `),
                pgPool.query(`
                    SELECT t_block_metrics.f_epoch, t_block_metrics.f_slot, t_eth2_pubkeys.f_pool_name, t_block_metrics.f_proposed, t_block_metrics.f_proposer_index,
                    t_block_metrics.f_graffiti, t_block_metrics.f_el_block_number
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

export const getSlotById = async (req: Request, res: Response) => {

    try {

        const { id } = req.params;
        const { network } = req.query;

        const pgPool = pgPools[network as string];

        const [ block, proposerDuties ] = 
            await Promise.all([
                pgPool.query(`
                    SELECT t_block_metrics.f_timestamp, t_block_metrics.f_epoch, t_block_metrics.f_slot,
                    t_block_metrics.f_graffiti, t_block_metrics.f_proposer_index, t_block_metrics.f_proposed,
                    t_block_metrics.f_attestations, t_block_metrics.f_deposits, t_block_metrics.f_proposer_slashings,
                    t_block_metrics.f_att_slashings, t_block_metrics.f_voluntary_exits, t_block_metrics.f_sync_bits,
                    t_block_metrics.f_el_fee_recp, t_block_metrics.f_el_gas_limit, t_block_metrics.f_el_gas_used,
                    t_block_metrics.f_el_transactions, t_block_metrics.f_el_block_hash, t_eth2_pubkeys.f_pool_name,
                    t_block_metrics.f_el_block_number
                    FROM t_block_metrics
                    LEFT OUTER JOIN t_eth2_pubkeys ON t_block_metrics.f_proposer_index = t_eth2_pubkeys.f_val_idx
                    WHERE f_slot = '${id}'
                `),
                pgPool.query(`
                    SELECT f_proposed
                    FROM t_proposer_duties
                    WHERE f_proposer_slot = '${id}'
                `),          
            ]);

        if (block.rows[0]) {
            if (proposerDuties.rows.length > 0) {
                block.rows[0].f_proposed = proposerDuties.rows[0].f_proposed;
            }
    
            res.json({
                block: {
                    ...block.rows[0],
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

export const getSlotsStats = async (req: Request, res: Response) => {

    try {

        const { network } = req.query;

        const pgPool = pgPools[network as string];
        
        const stats = 
            await pgPool.query(`
                SELECT MIN(f_proposer_slot) AS first, MAX(f_proposer_slot) AS last, COUNT(DISTINCT(f_proposer_slot)) AS count
                FROM t_proposer_duties
            `);

        res.json({
            stats: stats.rows[0]
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server'
        });
    }
};

export const getSlotsByGraffiti = async (req: Request, res: Response) => {

    try {

        const { network, page = 0, limit = 10 } = req.query;

        const pgPool = pgPools[network as string];

        const skip = Number(page) * Number(limit);
        
        const { id } = req.params;

        const blocks = 
            await pgPool.query(`
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

export const getWithdrawalsBySlot = async (req: Request, res: Response) => {

    try {

        const { id } = req.params;
        const { network } = req.query;

        const pgPool = pgPools[network as string];

        const withdrawals = 
            await pgPool.query(`
                SELECT f_val_idx, f_address, f_amount
                FROM t_withdrawals
                WHERE f_slot = '${id}'
            `);

        res.json({
            withdrawals: withdrawals.rows,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server'
        });
    }
};

export const listenSlotNotification = async (req: Request, res: Response) => {

    try {

        const { network } = req.query;

        const pgListener = pgListeners[network as string];

        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });

        pgListener?.once('new_head', msg => {
            res.write('event: new_slot\n');
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

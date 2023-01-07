import { Request, Response } from 'express';
import { pgClient } from '../config/db';

export const getEpochsStatistics = async (req: Request, res: Response) => {

    try {

        const { page = 0, limit = 10 } = req.query;

        const skip = Number(page) * Number(limit);

        const [ epochsStats, rewardsStats, blocksStats ] =
         await Promise.all([
            pgClient.query(`
                SELECT f_epoch, f_slot, f_num_att_vals, f_num_vals, 
                f_att_effective_balance_eth, f_total_effective_balance_eth,
                f_missing_source, f_missing_target, f_missing_head
                FROM t_epoch_metrics_summary
                ORDER BY f_epoch DESC
                OFFSET ${skip}
                LIMIT ${limit}
            `),
            pgClient.query(`
                SELECT AVG(f_reward) AS reward_average, AVG(f_max_reward) AS max_reward_average, f_epoch
                FROM (
                    SELECT f_val_idx, f_reward, f_max_reward, f_epoch
                    FROM t_validator_rewards_summary
                    WHERE f_epoch IN (
                        SELECT DISTINCT(f_epoch)
                        FROM t_block_metrics
                        ORDER BY f_epoch DESC
                        LIMIT ${limit}
                        OFFSET ${skip + 2}
                    )
                    ORDER BY f_epoch DESC
                ) t1
                LEFT JOIN t_proposer_duties ON t1.f_val_idx = t_proposer_duties.f_val_idx AND t1.f_epoch = t_proposer_duties.f_proposer_slot/32
                WHERE t_proposer_duties.f_val_idx IS null
                GROUP BY t1.f_epoch
                ORDER BY f_epoch desc
            `),
            pgClient.query(`
                SELECT f_proposer_slot/32 AS epoch, count(*) AS proposed_blocks
                FROM t_proposer_duties
                WHERE f_proposed = true
                GROUP BY epoch
                ORDER BY epoch DESC
                OFFSET ${skip}
                LIMIT ${limit}
            `)
        ]);

        let arrayEpochs = [];

        epochsStats.rows.forEach((epoch: any) => { 
            const aux = rewardsStats.rows.find((reward: any) => reward.f_epoch === epoch.f_epoch);
            const aux2 = blocksStats.rows.find((blocks: any) => blocks.epoch === epoch.f_epoch);
            arrayEpochs.push({  
                ...epoch, 
                ...aux, 
                ...aux2
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

        const blocks = await pgClient.query(`
            SELECT t_block_metrics.f_epoch, t_block_metrics.f_slot, t_eth2_pubkeys.f_pool_name, t_block_metrics.f_proposed, t_block_metrics.f_proposer_index,
            t_block_metrics.f_graffiti
            FROM t_block_metrics
            LEFT OUTER JOIN t_eth2_pubkeys ON t_block_metrics.f_proposer_index = t_eth2_pubkeys.f_val_idx
            ORDER BY f_slot DESC
            OFFSET ${skip}
            LIMIT ${limit}
        `);

        res.json({
            blocks: blocks.rows
        });

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

        pgClient.query('LISTEN new_head');

        pgClient.on('notification', async (msg) => {
            if (msg.channel === 'new_head') {
                res.write('event: new_block\n');
                res.write(`data: ${msg.payload}`);
                res.write('\n\n');
            }
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

        pgClient.query('LISTEN new_epoch_finalized');

        pgClient.on('notification', async (msg) => {
            if (msg.channel === 'new_epoch_finalized') {
                res.write('event: new_epoch\n');
                res.write(`data: ${msg.payload}`);
                res.write('\n\n');
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server'
        });
    }
};

import { Request, Response } from 'express';
import { pool } from '../config/db';

export const getEpochsStatistics = async (req: Request, res: Response) => {

    try {

        const { page = 0, limit = 10 } = req.query;

        const skip = Number(page) * Number(limit);

        const lastEpochResponse: any = await pool.query(`
            SELECT f_epoch
            FROM t_block_metrics
            ORDER BY f_epoch DESC
            LIMIT 1
        `);

        const lastEpoch = lastEpochResponse.rows[0].f_epoch;

        const [ epochsStats, rewardsStats, blocksStats ] =
         await Promise.all([
            pool.query(`
                SELECT f_epoch, f_slot, f_num_att_vals, f_num_vals, 
                f_att_effective_balance_eth, f_total_effective_balance_eth,
                f_missing_source, f_missing_target, f_missing_head
                FROM t_epoch_metrics_summary
                ORDER BY f_epoch DESC
                OFFSET ${skip}
                LIMIT ${limit}
            `),
            pool.query(`
                SELECT avg(f_reward) AS reward_average, avg(f_max_reward) AS max_reward_average, f_epoch
                FROM (select f_val_idx, f_reward, f_max_reward, f_epoch
                FROM t_validator_rewards_summary
                WHERE f_epoch > ${lastEpoch-10-skip}
                ORDER BY f_epoch desc) t1
                LEFT JOIN t_proposer_duties on t1.f_val_idx = t_proposer_duties.f_val_idx and t1.f_epoch = t_proposer_duties.f_proposer_slot/32
                WHERE t_proposer_duties.f_val_idx IS null
                GROUP BY t1.f_epoch
                ORDER BY f_epoch desc
            `),
            pool.query(`
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

        const blocks = await pool.query(`
            SELECT t_proposer_duties.f_val_idx, f_proposer_slot, f_pool_name, f_proposed, f_proposer_slot/32 AS epoch
            FROM t_proposer_duties
            LEFT OUTER JOIN t_eth2_pubkeys ON t_proposer_duties.f_val_idx = t_eth2_pubkeys.f_val_idx
            ORDER BY f_proposer_slot desc
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


            
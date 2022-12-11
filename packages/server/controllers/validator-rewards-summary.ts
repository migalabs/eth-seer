import { Request, Response } from 'express';
import { pool } from '../config/db';

export const getEpochsStatistics = async (req: Request, res: Response) => {

    try {

        const [ epochsStats, rewardsStats ] =
         await Promise.all([
            pool.query(`
                SELECT f_epoch, f_slot, f_num_att_vals, f_num_vals, 
                f_att_effective_balance_eth, f_total_effective_balance_eth,
                f_missing_source, f_missing_target, f_missing_head
                FROM t_epoch_metrics_summary
                ORDER BY f_epoch DESC
                LIMIT 10             
            `),
            pool.query(`
                SELECT avg(f_reward) as reward_average, avg(f_max_reward) max_reward_average, f_epoch
                FROM t_validator_rewards_summary
                WHERE f_proposer_slot = -1
                GROUP BY f_epoch
                ORDER BY f_epoch DESC
                LIMIT 10
            `)
        ]);

        let arrayEpochs = [];

        epochsStats.rows.forEach((epoch: any) => { 
            const aux = rewardsStats.rows.find((reward: any) => reward.f_epoch === epoch.f_epoch);
            arrayEpochs.push({  
                ...epoch, 
                ...aux 
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
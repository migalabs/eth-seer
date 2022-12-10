import { Request, Response } from 'express';
import { pool } from '../config/db';

export const getEpochsStatistics = async (req: Request, res: Response) => {

    try {

        const [ rows, count ] =
         await Promise.all([
            pool.query(`
                SELECT f_epoch, COUNT(CASE WHEN f_missing_source != 'false' THEN 1 ELSE null END) AS total_source, 
                COUNT(CASE WHEN f_missing_target != 'false' THEN 1 ELSE null END) AS total_target, 
                COUNT(CASE WHEN f_missing_head != 'false' THEN 1 ELSE null END) AS total_head
                FROM t_validator_rewards_summary
                GROUP BY f_epoch
                ORDER BY f_epoch DESC
                LIMIT 5;
            `),
            pool.query(`
                SELECT f_epoch, COUNT(f_epoch) AS total
                FROM t_validator_rewards_summary 
                WHERE (f_status = 'active' OR f_status = 'slashed') AND 
                t_validator_rewards_summary.f_max_att_reward <> 0
                GROUP BY f_epoch
                ORDER BY f_epoch DESC
                LIMIT 5;
            `),
        ]);
        
        res.json({
            rows: rows.rows,
            count: count.rows,
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server'
        });
    }
};
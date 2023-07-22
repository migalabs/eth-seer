import { Request, Response } from 'express';
import { pgClient } from '../config/db';

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

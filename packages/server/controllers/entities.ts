import { Request, Response } from 'express';
import { pgPool } from '../config/db';

export const getEntity = async (req: Request, res: Response) => {

    try {

        const { name } = req.params;
        const { numberEpochs = 225 } = req.query;

        const [ entityStats, blocksProposed, entityPerformance  ] = 
            await Promise.all([
                pgPool.query(`
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
                        LOWER(f_pool_name) = '${name.toLowerCase()}'
                `),
                pgPool.query(`
                    SELECT 
                        COUNT(CASE  f_proposed WHEN true THEN 1 ELSE null END) AS f_proposed,
                        COUNT(CASE  f_proposed WHEN false THEN 1 ELSE null END) AS f_missed
                    FROM
                        t_proposer_duties
                    LEFT OUTER JOIN 
                        t_eth2_pubkeys ON t_proposer_duties.f_val_idx = t_eth2_pubkeys.f_val_idx
                    WHERE 
                        LOWER(f_pool_name) = '${name.toLowerCase()}'
                `),
                pgPool.query(`
                    SELECT 
                        SUM(aggregated_rewards) AS aggregated_rewards,
                        SUM(aggregated_max_rewards) AS aggregated_max_rewards,
                        SUM(count_sync_committee) AS count_sync_committee,
                        SUM(count_missing_source) AS count_missing_source,
                        SUM(count_missing_target) AS count_missing_target,
                        SUM(count_missing_head) AS count_missing_head,
                        SUM(count_expected_attestations) AS count_expected_attestations,
                        SUM(proposed_blocks_performance) AS proposed_blocks_performance,
                        SUM(missed_blocks_performance) AS missed_blocks_performance,
                        SUM(number_active_vals) AS number_active_vals
                    FROM (
                        SELECT *
                        FROM t_pool_summary
                        WHERE LOWER(f_pool_name) = '${name.toLowerCase()}'
                        ORDER BY f_epoch DESC
                        LIMIT ${numberEpochs}
                    ) AS subquery;
                `),
            ]);

        let entity = null;

        if (entityStats.rows.length > 0) {
            entity = {
                ...entityStats.rows[0],
                proposed_blocks: blocksProposed.rows[0],
                ...entityPerformance.rows[0]
            };
        }

        res.json({
            entity
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server'
        });
    }
};

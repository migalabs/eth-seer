import { Request, Response } from 'express';
import { pgPools } from '../config/db';

export const getEntity = async (req: Request, res: Response) => {

    try {

        const { name } = req.params;
        const { network, numberEpochs = 225 } = req.query;

        const pgPool = pgPools[network as string];

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
                        LIMIT ${Number(numberEpochs)}
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


export const getEntities = async (req: Request, res: Response) => {

    try {

        const { network } = req.query;

        const pgPool = pgPools[network as string];

        const [entities, count]  = 
            await Promise.all([
                pgPool.query(`
                    SELECT count(CASE  f_status WHEN 1 THEN 1 ELSE null END) as act_number_validators, f_pool_name
                    FROM t_eth2_pubkeys
                    LEFT OUTER JOIN 
                    t_validator_last_status ON t_validator_last_status.f_val_idx = t_eth2_pubkeys.f_val_idx
                    GROUP BY f_pool_name
                `),
                pgPool.query(`
                    SELECT COUNT(DISTINCT(f_pool_name)) AS count
                    FROM t_eth2_pubkeys
                `),
            ]);
        
        res.json({
            entities: entities.rows,
            totalCount: Number(count.rows[0].count),
        });
        

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server'
        });
    }
};

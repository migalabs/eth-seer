import { Request, Response } from 'express';
import { clickhouseClients } from '../config/db';

export const getEntity = async (req: Request, res: Response) => {
    try {
        const { name } = req.params;
        const { network, numberEpochs = 225 } = req.query;

        const chClient = clickhouseClients[network as string];

        const [entityStatsResultSet, blocksProposedResultSet, entityPerformanceResultSet] = await Promise.all([
            chClient.query({
                query: `
                        SELECT SUM(f_balance_eth) AS aggregate_balance,
                            COUNT(CASE vls.f_status WHEN 0 THEN 1 ELSE null END) AS deposited,
                            COUNT(CASE vls.f_status WHEN 1 THEN 1 ELSE null END) AS active,
                            COUNT(CASE vls.f_status WHEN 2 THEN 1 ELSE null END) AS exited,
                            COUNT(CASE vls.f_status WHEN 3 THEN 1 ELSE null END) AS slashed
                        FROM
                            t_validator_last_status vls
                        INNER JOIN
                            t_eth2_pubkeys pk ON (vls.f_val_idx = pk.f_val_idx) AND (LOWER(pk.f_pool_name) = '${name.toLowerCase()}')
                    `,
                format: 'JSONEachRow',
            }),
            chClient.query({
                query: `
                        SELECT
                            COUNT(CASE pd.f_proposed WHEN true THEN 1 ELSE null END) AS f_proposed,
                            COUNT(CASE pd.f_proposed WHEN false THEN 1 ELSE null END) AS f_missed
                        FROM
                            t_proposer_duties pd
                        INNER JOIN
                            t_eth2_pubkeys pk ON (pd.f_val_idx = pk.f_val_idx) AND (LOWER(pk.f_pool_name) = '${name.toLowerCase()}')
                    `,
                format: 'JSONEachRow',
            }),
            chClient.query({
                query: `
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
                    `,
                format: 'JSONEachRow',
            }),
        ]);

        const entityStatsResult = await entityStatsResultSet.json();
        const blocksProposedResult = await blocksProposedResultSet.json();
        const entityPerformanceResult = await entityPerformanceResultSet.json();

        let entity = null;

        if (entityStatsResult[0]) {
            entity = {
                ...entityStatsResult[0],
                proposed_blocks: blocksProposedResult[0],
                ...entityPerformanceResult[0],
            };
        }

        res.json({
            entity,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server',
        });
    }
};

export const getEntities = async (req: Request, res: Response) => {
    try {
        const { network } = req.query;

        const chClient = clickhouseClients[network as string];

        const [entitiesResultSet, countResultSet] = await Promise.all([
            chClient.query({
                query: `
                        SELECT
                            COUNT(CASE vls.f_status WHEN 1 THEN 1 ELSE null END) AS act_number_validators,
                            pk.f_pool_name
                        FROM
                            t_validator_last_status vls
                        LEFT OUTER JOIN
                            t_eth2_pubkeys pk ON (vls.f_val_idx = pk.f_val_idx)
                        GROUP BY pk.f_pool_name
                    `,
                format: 'JSONEachRow',
            }),
            chClient.query({
                query: `
                        SELECT COUNT(DISTINCT(f_pool_name)) AS count
                        FROM t_eth2_pubkeys
                    `,
                format: 'JSONEachRow',
            }),
        ]);

        const entitiesResult = await entitiesResultSet.json();
        const countResult = await countResultSet.json();

        res.json({
            entities: entitiesResult,
            totalCount: Number(countResult[0].count),
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server',
        });
    }
};

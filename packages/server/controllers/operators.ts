import { Request, Response } from 'express';
import { clickhouseClients } from '../config/db';

export const getOperators = async (req: Request, res: Response) => {
    try {
        const { network, page = 0, limit = 10 } = req.query;

        const chClient = clickhouseClients[network as string];

        const skip = Number(page) * Number(limit);

        const [operatorsBalanceResultSet, operatorsStatsResultSet, operatorsResultSet, countResultSet] = await Promise.all([
            chClient.query({
                query: `
                        SELECT
                            SUM(vls.f_balance_eth) AS aggregate_balance,
                            pk.f_pool_name
                        FROM
                            t_validator_last_status vls
                        INNER JOIN
                            t_eth2_pubkeys pk ON (vls.f_val_idx = pk.f_val_idx)
                        WHERE
                            pk.f_pool_name LIKE 'csm_%_lido'
                        GROUP BY pk.f_pool_name
                    `,
                format: 'JSONEachRow',
            }),
            chClient.query({
                query: `
                        SELECT
                            COUNT(CASE vls.f_status WHEN 0 THEN 1 ELSE NULL END) AS deposited,
                            COUNT(CASE vls.f_status WHEN 1 THEN 1 ELSE NULL END) AS active,
                            COUNT(CASE vls.f_status WHEN 2 THEN 1 ELSE NULL END) AS exited,
                            COUNT(CASE vls.f_status WHEN 3 THEN 1 ELSE NULL END) AS slashed,
                            COUNT(CASE pd.f_proposed WHEN true THEN 1 ELSE NULL END) AS f_proposed,
                            COUNT(CASE pd.f_proposed WHEN false THEN 1 ELSE NULL END) AS f_missed,
                            SUM(vls.f_balance_eth) AS aggregate_balance,
                            pk.f_pool_name
                        FROM
                            t_validator_last_status vls
                        INNER JOIN
                            t_eth2_pubkeys pk ON (vls.f_val_idx = pk.f_val_idx)
                        LEFT JOIN
                            t_proposer_duties pd ON (vls.f_val_idx = pd.f_val_idx)
                        WHERE
                            pk.f_pool_name LIKE 'csm_%_lido' AND pd.f_val_idx != 0
                        GROUP BY pk.f_pool_name
                    `,
                format: 'JSONEachRow',
            }),
            chClient.query({
                query: `
                        SELECT
                            COUNT(CASE vls.f_status WHEN 1 THEN 1 ELSE NULL END) AS act_number_validators,
                            SUM(vls.f_balance_eth) AS aggregate_balance,
                            pk.f_pool_name
                        FROM
                            t_validator_last_status vls
                        LEFT OUTER JOIN
                            t_eth2_pubkeys pk ON (vls.f_val_idx = pk.f_val_idx)
                        WHERE
                            pk.f_pool_name LIKE 'csm_%_lido'
                        GROUP BY pk.f_pool_name
                        ORDER BY aggregate_balance desc
                        LIMIT ${Number(limit)}
                        OFFSET ${skip};
                    `,
                format: 'JSONEachRow',
            }),
            chClient.query({
                query: `
                        SELECT COUNT(DISTINCT(f_pool_name)) AS count
                        FROM t_eth2_pubkeys
                        WHERE f_pool_name LIKE 'csm_%_lido';
                    `,
                format: 'JSONEachRow',
            }),
        ]);

        const operatorsBalanceResult = await operatorsBalanceResultSet.json();
        const operatorsStatsResult = await operatorsStatsResultSet.json();
        const operatorsResult = await operatorsResultSet.json();
        const countResult = await countResultSet.json();

        res.json({
            operatorsBalance: operatorsBalanceResult,
            operatorsStats: operatorsStatsResult,
            operators: operatorsResult,
            totalCount: Number(countResult[0].count),
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: 'Internal Server Error'
        });
    }
};

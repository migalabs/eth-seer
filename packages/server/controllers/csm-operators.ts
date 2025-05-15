import { Request, Response } from 'express';
import { clickhouseClients } from '../config/db';

interface OperatorReward {
    f_pool_name: string;
    aggregated_rewards: number;
    aggregated_max_rewards: number;
}

export const getCsmOperators = async (req: Request, res: Response) => {
    try {
        const { network } = req.query;

        const chClient = clickhouseClients[network as string];


        const [operatorsBalanceResultSet, operatorsValidatorResultSet, operatorsBlockResultSet, operatorsResultSet, countResultSet, operatorsRewardsResultSet, lidoParticipationResultSet, overallNetParticipationResultSet, lidoMetricsResultSet, overallNetMetricsResultSet] = await Promise.all([
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
                            COUNT(CASE vls.f_status WHEN 1 THEN 1 ELSE NULL END) AS act_number_validators,
                            COUNT(CASE vls.f_status WHEN 2 THEN 1 ELSE NULL END) AS exited,
                            COUNT(CASE vls.f_status WHEN 3 THEN 1 ELSE NULL END) AS slashed,
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
                            COUNT(CASE pd.f_proposed WHEN true THEN 1 ELSE NULL END) AS f_proposed,
                            COUNT(CASE pd.f_proposed WHEN false THEN 1 ELSE NULL END) AS f_missed,
                            pk.f_pool_name
                        FROM
                            t_eth2_pubkeys pk
                        INNER JOIN
                            t_proposer_duties pd ON (pk.f_val_idx = pd.f_val_idx)
                        WHERE
                            pk.f_pool_name LIKE 'csm_%_lido'
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
                        ORDER BY LENGTH(pk.f_pool_name), pk.f_pool_name
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
            chClient.query({
                query: `
                    SELECT
                        f_pool_name,
                        SUM(toInt64(aggregated_rewards)) AS aggregated_rewards,
                        SUM(aggregated_max_rewards) AS aggregated_max_rewards
                    FROM (
                        SELECT *
                        FROM t_pool_summary
                        WHERE f_pool_name LIKE 'csm_operator%_lido'
                        AND f_epoch >= (SELECT MAX(f_epoch) - 6750 FROM t_pool_summary)
                    ) AS subquery
                    GROUP BY f_pool_name
                `,
                format: 'JSONEachRow',
            }),
            chClient.query({
                query: `
                        SELECT
                            SUM(count_attestations_included) / SUM(count_expected_attestations) AS participation_rate
                        FROM
                            t_pool_summary
                        WHERE
                            LOWER(f_pool_name)  LIKE 'csm_%'
                                AND
                            f_epoch >= (
                                SELECT
                                    max(f_epoch)
                                FROM
                                    t_epoch_metrics_summary
                                ) - 6750
                    `,
                format: 'JSONEachRow',
            }),
            chClient.query({
                query: `
                        SELECT
                            SUM(f_num_att_vals) / SUM(f_num_active_vals) AS participation_rate
                        FROM
                            t_epoch_metrics_summary
                        WHERE
                            f_epoch >= (
                                SELECT
                                    max(f_epoch)
                                FROM
                                    t_epoch_metrics_summary
                                ) - 6750
                    `,
                format: 'JSONEachRow',
            }),
            chClient.query({
                query: `
                        SELECT
                            1 - SUM(count_missing_source) / SUM(number_active_vals) AS missing_source,
                            1 - SUM(count_missing_target) / SUM(number_active_vals) AS missing_target,
                            1 - SUM(count_missing_head) / SUM(number_active_vals) AS missing_head
                        FROM (
                            SELECT *
                            FROM t_pool_summary
                            WHERE f_pool_name LIKE 'csm_%'
                            AND f_epoch >= (SELECT
                                                f_epoch - 6750
                                            FROM
                                                t_pool_summary
                                            ORDER BY f_epoch desc
                                            LIMIT 1)
                        );
                    `,
                format: 'JSONEachRow',
            }),
            chClient.query({
                query: `
                        SELECT
                            1 - SUM(f_missing_source) / SUM(f_num_att_vals) AS missing_source,
                            1 - SUM(f_missing_target) / SUM(f_num_att_vals) AS missing_target,
                            1 - SUM(f_missing_head) / SUM(f_num_att_vals) AS missing_head
                        FROM (
                            SELECT *
                            FROM t_epoch_metrics_summary
                            WHERE f_epoch >= (
                                        SELECT
                                            max(f_epoch)
                                        FROM
                                            t_epoch_metrics_summary
                                        ) - 6750
                        );
                    `,
                format: 'JSONEachRow',
            }),
        ]);

        const operatorsBalanceResult = await operatorsBalanceResultSet.json();
        const operatorsValidatorResult = await operatorsValidatorResultSet.json();
        const operatorsBlockResult = await operatorsBlockResultSet.json();
        const operatorsResult: [] = await operatorsResultSet.json();
        const countResult = await countResultSet.json();
        const operatorsRewardsResult: OperatorReward[] = await operatorsRewardsResultSet.json();
        const lidoParticipationResult = await lidoParticipationResultSet.json();
        const overallNetParticipationResult = await overallNetParticipationResultSet.json();
        const lidoMetricsResult = await lidoMetricsResultSet.json();
        const overallNetMetricsResult = await overallNetMetricsResultSet.json();

        const operatorsRewards = operatorsResult.map((operator: any) => {
            const rewards: OperatorReward = operatorsRewardsResult.find(
                (reward: any) => reward.f_pool_name === operator.f_pool_name
            );

            return {
                ...operator,
                aggregated_rewards: rewards?.aggregated_rewards || 0,
                aggregated_max_rewards: rewards?.aggregated_max_rewards || 0,
            };
        });

        res.json({
            operatorsBalance: operatorsBalanceResult,
            operatorsValidator: operatorsValidatorResult,
            operatorsBlock: operatorsBlockResult,
            operators: operatorsRewards,
            totalCount: Number(countResult[0].count),
            lidoParticipationRate: lidoParticipationResult?.[0]?.participation_rate,
            overallNetParticipationRate: overallNetParticipationResult?.[0]?.participation_rate,
            lidoMetrics: lidoMetricsResult[0],
            overallNetMetrics: overallNetMetricsResult[0],
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: 'Internal Server Error'
        });
    }
};

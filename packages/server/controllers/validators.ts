import { Request, Response } from "express";
import { clickhouseClients } from "../config/db";

export const getValidators = async (req: Request, res: Response) => {
  try {
    const { network, page = 0, limit = 10 } = req.query;

    if (!network) {
      console.error("Network is missing");
      return res.status(400).json({ msg: "Network parameter is required" });
    }

    const chClient = clickhouseClients[network as string];

    if (!chClient) {
      console.error(`No ClickHouse client found for network: ${network}`);
      return res.status(400).json({ msg: `Invalid network: ${network}` });
    }

    const offset = Number(page) * Number(limit);

    const [validatorsResultSet, countResultSet] = await Promise.all([
      chClient.query({
        query: `
                        SELECT
                            vls.f_val_idx AS f_val_idx,
                            vls.f_balance_eth AS f_balance_eth,
                            pk.f_pool_name AS f_pool_name,
                            s.f_status AS f_status
                        FROM
                            t_validator_last_status vls
                        LEFT OUTER JOIN
                            t_eth2_pubkeys pk ON vls.f_val_idx = pk.f_val_idx
                        LEFT OUTER JOIN
                            t_status s ON vls.f_status = s.f_id
                        ORDER BY
                            vls.f_val_idx DESC
                        LIMIT {limit: Int64}
                        OFFSET {offset: Int64}
                    `,
        query_params: { limit, offset },
        format: "JSONEachRow",
      }),
      chClient.query({
        query: `
                        SELECT COUNT(*) AS count
                        FROM t_validator_last_status
                    `,
        format: "JSONEachRow",
      }),
    ]);

    const validatorsResult = await validatorsResultSet.json();
    const countResult = await countResultSet.json();

    if (
      !Array.isArray(countResult) ||
      countResult.length === 0 ||
      !countResult[0].count
    ) {
      console.error(
        "Count result is undefined or in an unexpected format:",
        countResult,
      );
      throw new Error("Failed to fetch the total count of validators");
    }

    res.json({
      validators: validatorsResult,
      totalCount: Number(countResult[0].count),
    });
  } catch (error) {
    console.error("Error in getValidators:", {
      message: error.message,
      stack: error.stack,
      request: {
        query: req.query,
      },
    });
    res.status(500).json({
      msg: "An error occurred on the server",
      error: error.message,
    });
  }
};

export const getValidatorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { network, numberEpochs = 225 } = req.query;

    const chClient = clickhouseClients[network as string];

    const [
      validatorStatsResultSet,
      validatorPerformanceResultSet,
      overallNetworkResultSet,
    ] = await Promise.all([
      chClient.query({
        query: `
                        SELECT
                            vls.f_val_idx AS f_val_idx,
                            vls.f_epoch AS f_epoch,
                            vls.f_balance_eth AS f_balance_eth,
                            pk.f_pool_name AS f_pool_name,
                            s.f_status AS f_status
                        FROM
                            t_validator_last_status vls
                        LEFT OUTER JOIN
                            t_eth2_pubkeys pk ON vls.f_val_idx = pk.f_val_idx
                        LEFT OUTER JOIN
                            t_status s ON vls.f_status = s.f_id
                        WHERE
                            vls.f_val_idx = {id: Int64}
                    `,
        query_params: { id },
        format: "JSONEachRow",
      }),
      chClient.query({
        query: `
                        WITH Last225Epochs AS (
                            SELECT MIN(f_epoch) as start_epoch, MAX(f_epoch) as end_epoch
                            FROM (
                                SELECT f_epoch
                                FROM t_validator_rewards_summary
                                WHERE f_val_idx = '${id}'
                                ORDER BY f_epoch DESC
                                LIMIT {limit: Int64}
                            ) AS sub
                        )

                        SELECT
                            SUM(CASE WHEN f_status IN (1, 3) AND (f_reward <= f_max_reward) AND (f_reward > 0 ) THEN f_reward ELSE 0 END) as aggregated_rewards,
                            SUM(CASE WHEN f_status IN (1, 3) AND (f_reward <= f_max_reward) AND (f_reward > 0 ) THEN f_max_reward ELSE 0 END) as aggregated_max_rewards,
                            COUNT(CASE WHEN f_in_sync_committee = TRUE THEN 1 ELSE null END) as count_sync_committee,
                            COUNT(CASE WHEN f_missing_source = TRUE THEN 1 ELSE null END) as count_missing_source,
                            COUNT(CASE WHEN f_missing_target = TRUE THEN 1 ELSE null END) as count_missing_target,
                            COUNT(CASE WHEN f_missing_head = TRUE THEN 1 ELSE null END) as count_missing_head,
                            COUNT(CASE WHEN f_status IN (1, 3) THEN 1 ELSE 0 END) as count_attestations,
                            (
                                SELECT COUNT(CASE WHEN t_proposer_duties.f_proposed = TRUE THEN 1 ELSE null END)
                                FROM t_proposer_duties
                                WHERE t_proposer_duties.f_val_idx = '${id}'
                                AND CAST((t_proposer_duties.f_proposer_slot / 32) AS UInt64) BETWEEN (SELECT start_epoch FROM Last225Epochs) AND (SELECT end_epoch FROM Last225Epochs)
                            ) as proposed_blocks_performance,
                            (
                                SELECT COUNT(CASE WHEN t_proposer_duties.f_proposed = FALSE THEN 1 ELSE null END)
                                FROM t_proposer_duties
                                WHERE t_proposer_duties.f_val_idx = '${id}'
                                AND CAST((t_proposer_duties.f_proposer_slot / 32) AS UInt64) BETWEEN (SELECT start_epoch FROM Last225Epochs) AND (SELECT end_epoch FROM Last225Epochs)
                            ) as missed_blocks_performance
                        FROM t_validator_rewards_summary
                        LEFT JOIN t_proposer_duties
                            ON t_validator_rewards_summary.f_val_idx = t_proposer_duties.f_val_idx
                            AND toUInt64(t_validator_rewards_summary.f_epoch) = toUInt64(t_proposer_duties.f_proposer_slot/32)
                        WHERE t_validator_rewards_summary.f_val_idx = '${id}'
                        AND t_validator_rewards_summary.f_epoch BETWEEN (SELECT start_epoch FROM Last225Epochs) AND (SELECT end_epoch FROM Last225Epochs)
                        GROUP BY t_validator_rewards_summary.f_val_idx;
                    `,
        query_params: { limit: Number(numberEpochs) },
        format: "JSONEachRow",
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
                                ORDER BY f_epoch DESC
                                LIMIT {limit: Int64}
                            );
                    `,
        query_params: { limit: Number(numberEpochs) },
        format: "JSONEachRow",
      }),
    ]);

    const validatorStatsResult = await validatorStatsResultSet.json();
    const validatorPerformanceResult =
      await validatorPerformanceResultSet.json();
    const overallNetworkResult = await overallNetworkResultSet.json();

    let validator = null;

    if (validatorStatsResult[0]) {
      validator = {
        ...validatorStatsResult[0],
        ...validatorPerformanceResult[0],
      };
    }

    res.json({
      validator,
      metricsOverallNetwork: overallNetworkResult[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "An error occurred on the server",
    });
  }
};

export const getCountActiveValidators = async (req: Request, res: Response) => {
  try {
    const { network } = req.query;

    const chClient = clickhouseClients[network as string];

    const countActiveValidatorsResultSet = await chClient.query({
      query: `
                    SELECT
                        COUNT(*) AS count_active_validators
                    FROM
                        t_validator_last_status vls
                    WHERE
                        f_status = 1
                `,
      format: "JSONEachRow",
    });

    const countActiveValidators = await countActiveValidatorsResultSet.json();

    res.json({
      count_active_validators: countActiveValidators[0].count_active_validators,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "An error occurred on the server",
    });
  }
};

export const getProposedBlocksByValidator = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const { network } = req.query;

    const chClient = clickhouseClients[network as string];

    const proposedBlocksResultSet = await chClient.query({
      query: `
                    SELECT
                        pd.f_val_idx AS f_val_idx,
                        pd.f_proposer_slot AS f_proposer_slot,
                        pd.f_proposed AS f_proposed,
                        pk.f_pool_name AS f_pool_name
                    FROM
                        t_proposer_duties pd
                    LEFT OUTER JOIN
                        t_eth2_pubkeys pk ON pd.f_val_idx = pk.f_val_idx
                    WHERE
                        pd.f_val_idx = {id: Int64}
                    ORDER BY
                        pd.f_proposer_slot DESC
                `,
      query_params: { id },
      format: "JSONEachRow",
    });

    const proposedBlocks = await proposedBlocksResultSet.json();

    res.json({
      proposedBlocks,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "An error occurred on the server",
    });
  }
};

export const getWithdrawalsByValidator = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const { network } = req.query;

    const chClient = clickhouseClients[network as string];

    const withdrawalsResultSet = await chClient.query({
      query: `
                    SELECT
                        f_val_idx,
                        CAST((f_slot / 32) AS UInt64) AS f_epoch,
                        f_slot,
                        f_address,
                        f_amount
                    FROM
                        t_withdrawals
                    WHERE
                        f_val_idx = {id: Int64}
                    ORDER BY
                        f_slot DESC
                `,
      query_params: { id },
      format: "JSONEachRow",
    });

    const withdrawals = await withdrawalsResultSet.json();

    res.json({
      withdrawals,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "An error occurred on the server",
    });
  }
};

export const getValidatorsByPool = async (req: Request, res: Response) => {
  try {
    const pool = req.params.name;
    const { network, page = 0, limit = 10 } = req.query;

    const chClient = clickhouseClients[network as string];

    const offset = Number(page) * Number(limit);

    const [validatorsResultSet, countResultSet] = await Promise.all([
      chClient.query({
        query: `
                        SELECT
                            vls.f_val_idx AS f_val_idx,
                            vls.f_epoch AS f_epoch,
                            vls.f_balance_eth AS f_balance_eth,
                            pk.f_pool_name AS f_pool_name,
                            s.f_status AS f_status
                        FROM
                            t_validator_last_status vls
                        LEFT OUTER JOIN
                            t_eth2_pubkeys pk ON vls.f_val_idx = pk.f_val_idx
                        LEFT OUTER JOIN
                            t_status s ON vls.f_status = s.f_id
                        WHERE
                            pk.f_pool_name = {poolName: String}
                        ORDER BY
                            vls.f_val_idx
                        LIMIT {limit: Int64}
                        OFFSET {offset: Int64}
                    `,
        query_params: { poolName: pool, limit, offset },
        format: "JSONEachRow",
      }),
      chClient.query({
        query: `
                        SELECT COUNT(*) AS count
                        FROM
                            t_validator_last_status vls
                        LEFT OUTER JOIN
                            t_eth2_pubkeys pk ON vls.f_val_idx = pk.f_val_idx
                        WHERE
                            pk.f_pool_name = {poolName: String}
                    `,
        query_params: { poolName: pool },
        format: "JSONEachRow",
      }),
    ]);

    const validators = await validatorsResultSet.json();
    const countResult = await countResultSet.json();

    res.json({
      validators: validators,
      totalCount: Number(countResult[0].count),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "An error occurred on the server",
    });
  }
};

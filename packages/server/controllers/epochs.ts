import { Request, Response } from 'express';
import { clickhouseClients } from '../config/db';

export const getEpochsStatistics = async (req: Request, res: Response) => {
    try {
        const { network, page = 0, limit = 10 } = req.query;

        const clickhouseClient = clickhouseClients[network as string];

        const skip = Number(page) * Number(limit);

        const [epochsStatsResultSet, blocksStatsResultSet, epochsCountResultSet] = await Promise.all([
            clickhouseClient
                .query({
                    query: `
                        SELECT
                            f_epoch,
                            f_slot,
                            f_num_att,
                            f_num_att_vals,
                            f_num_active_vals,
                            f_att_effective_balance_eth,
                            f_total_effective_balance_eth,
                            f_missing_source,
                            f_missing_target,
                            f_missing_head,
                            f_withdrawals_num,
                            f_deposits_num,
                            f_new_proposer_slashings,
                            f_new_attester_slashings
                        FROM
                            t_epoch_metrics_summary
                        ORDER BY
                            f_epoch DESC
                        LIMIT ${Number(limit)}
                        OFFSET ${skip}
                    `,
                    format: 'JSONEachRow',
                })
                .catch((err: any) => {
                    console.error('Error executing epochsStats query:', err);
                    throw new Error('Failed to execute epochsStats query');
                }),
            clickhouseClient
                .query({
                    query: `
                        SELECT
                            CAST((f_proposer_slot / 32) AS UInt64) AS epoch,
                            groupArray(CASE WHEN f_proposed = 1 THEN 1 ELSE 0 END) AS proposed_blocks
                        FROM
                            t_proposer_duties
                        GROUP BY
                            epoch
                        ORDER BY
                            epoch DESC
                        LIMIT ${Number(limit) + 1}
                        OFFSET ${skip}
                    `,
                    format: 'JSONEachRow',
                })
                .catch((err: any) => {
                    console.error('Error executing blocksStats query:', err);
                    throw new Error('Failed to execute blocksStats query');
                }),
            clickhouseClient
                .query({
                    query: `
                        SELECT COUNT(*) AS count
                        FROM t_epoch_metrics_summary
                    `,
                    format: 'JSONEachRow',
                })
                .catch((err: any) => {
                    console.error('Error executing epochsCount query:', err);
                    throw new Error('Failed to execute epochsCount query');
                }),
        ]);

        const epochsStatsResult: any[] = await epochsStatsResultSet.json();
        const blocksStatsResult: any[] = await blocksStatsResultSet.json();
        const epochsCountResult = await epochsCountResultSet.json();

        let arrayEpochs = [];

        epochsStatsResult.forEach((epoch: any) => {
            const aux = blocksStatsResult.find((blocks: any) => Number(blocks.epoch) === Number(epoch.f_epoch));
            arrayEpochs.push({
                ...epoch,
                proposed_blocks: aux?.proposed_blocks,
            });
        });

        res.json({
            epochsStats: arrayEpochs,
            totalCount: Number(epochsCountResult[0].count),
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server',
        });
    }
};

export const getEpochById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { network } = req.query;

        const clickhouseClient = clickhouseClients[network as string];

        const [epochStatsResultSet, blocksProposedResultSet, withdrawalsResultSet] = await Promise.all([
            clickhouseClient.query({
                query: `
                        SELECT
                            f_epoch,
                            f_slot,
                            f_num_att,
                            f_deposits_num,
                            f_withdrawals_num,
                            f_num_att_vals,
                            f_num_active_vals,
                            f_att_effective_balance_eth,
                            f_total_effective_balance_eth,
                            f_missing_source,
                            f_missing_target,
                            f_missing_head,
                            f_num_slashed_vals,
                            f_num_active_vals,
                            f_num_exited_vals,
                            f_num_in_activation_vals,
                            f_total_balance_eth

                        FROM
                            t_epoch_metrics_summary
                        WHERE
                            f_epoch = ${id}
                    `,
                format: 'JSONEachRow',
            }),
            clickhouseClient.query({
                query: `
                        SELECT
                            COUNT(*) AS proposed_blocks
                        FROM
                            t_proposer_duties
                        WHERE
                            CAST((f_proposer_slot / 32) AS UInt64) = ${id} AND f_proposed = 1
                    `,
                format: 'JSONEachRow',
            }),
            clickhouseClient.query({
                query: `
                        SELECT
                            SUM(f_amount) AS total_withdrawals
                        FROM
                            t_withdrawals
                        WHERE
                            CAST((f_slot / 32) AS UInt64) = ${id}
                    `,
                format: 'JSONEachRow',
            }),
        ]);

        const epochStatsResult = await epochStatsResultSet.json();
        const blocksProposedResult = await blocksProposedResultSet.json();
        const withdrawalsResult = await withdrawalsResultSet.json();

        res.json({
            epoch: {
                ...epochStatsResult[0],
                ...blocksProposedResult[0],
                withdrawals: withdrawalsResult[0].total_withdrawals,
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server',
        });
    }
};

export const getSlotsByEpoch = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { network } = req.query;

        const clickhouseClient = clickhouseClients[network as string];

        const [slotsEpochResultSet, withdrawalsResultSet] = await Promise.all([
            clickhouseClient.query({
                query: `
                        SELECT
                            pd.f_val_idx AS f_val_idx,
                            pd.f_proposer_slot AS f_proposer_slot,
                            pd.f_proposed AS f_proposed,
                            pk.f_pool_name AS f_pool_name,
                            hd.f_block AS f_block,
                            bm.f_attestations AS f_attestations,
                            bm.f_sync_bits AS f_sync_bits,
                            bm.f_deposits AS f_deposits,
                            bm.f_attester_slashings AS f_attester_slashings,
                            bm.f_proposer_slashings AS f_proposer_slashings,
                            bm.f_voluntary_exits AS f_voluntary_exits
                        FROM
                            t_proposer_duties pd
                        LEFT OUTER JOIN
                            t_eth2_pubkeys pk ON pd.f_val_idx = pk.f_val_idx
                        LEFT OUTER JOIN
                            t_head_events hd ON CAST(pd.f_proposer_slot AS String) = CAST(hd.f_slot AS String)
                        LEFT OUTER JOIN
                            t_block_metrics bm ON CAST(pd.f_proposer_slot AS String) = CAST(bm.f_slot AS String)
                        WHERE
                            CAST((pd.f_proposer_slot / 32) AS UInt64) = ${id}
                        ORDER BY
                            pd.f_proposer_slot DESC
                    `,
                format: 'JSONEachRow',
            }),
            clickhouseClient.query({
                query: `
                        SELECT
                            f_slot,
                            f_amount
                        FROM
                            t_withdrawals
                        WHERE
                            CAST((f_slot / 32) AS UInt64) = ${id}
                    `,
                format: 'JSONEachRow',
            }),
        ]);

        const slotsEpochResult: any[] = await slotsEpochResultSet.json();
        const withdrawalsResult: any[] = await withdrawalsResultSet.json();
        const withdrawalsCounts:any[] = withdrawalsResult.reduce((acc, withdrawal) => {
            if (!acc[withdrawal.f_slot]) {
                acc[withdrawal.f_slot] = { count: 0 }; 
            } 
            acc[withdrawal.f_slot].count += 1;
            return acc;
        }, {});
        const slotCount:any[] = Object.entries(withdrawalsCounts).map(([slot, data]) => ({ slot: parseInt(slot), count: data.count}));

        const slots = slotsEpochResult.map((slot: any) => ({
            ...slot,
            withdrawals: withdrawalsResult
                .filter((withdrawal: any) => withdrawal.f_slot === slot.f_proposer_slot)
                .reduce((acc: number, withdrawal: any) => acc + Number(withdrawal.f_amount), 0),
            num_withdrawals: slotCount
                .find(result => result.slot === slot.f_proposer_slot)?.count || 0,
        }));

        res.json({
            slots,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server',
        });
    }
};

export const listenEpochNotification = async (req: Request, res: Response) => {
    try {
        const { network } = req.query;

        const chClient = clickhouseClients[network as string];

        const blockGenesisResultSet = await chClient.query({
            query: `
                SELECT f_genesis_time
                FROM t_genesis
                LIMIT 1
            `,
            format: 'JSONEachRow',
        });

        const blockGenesisResult = await blockGenesisResultSet.json();

        const genesisTime = Number(blockGenesisResult[0].f_genesis_time) * 1000;

        const nextEpoch = Math.floor((Date.now() - genesisTime) / 12000 / 32) - 1;

        const newEpochEstimatedTime = genesisTime + (nextEpoch + 2) * 12000 * 32 + 4000;

        await new Promise(resolve => setTimeout(resolve, newEpochEstimatedTime - Date.now()));

        let latestEpochInserted = 0;
        let currentTimeout = 1000;

        do {
            if (latestEpochInserted > 0) {
                await new Promise(resolve => setTimeout(resolve, currentTimeout));
                currentTimeout *= 1.5;
            }

            const latestEpochResultSet = await chClient.query({
                query: `
                    SELECT
                        f_epoch
                    FROM
                        t_epoch_metrics_summary
                    ORDER BY
                        f_epoch DESC
                    LIMIT 1
                `,
                format: 'JSONEachRow',
            });

            const latestEpochResult = await latestEpochResultSet.json();

            latestEpochInserted = latestEpochResult[0]?.f_epoch ?? 0;
        } while (latestEpochInserted < nextEpoch);

        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
        });

        res.write('event: new_epoch\n');
        res.write(`data: Epoch ${nextEpoch}`);
        res.write('\n\n');
        res.end();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server',
        });
    }
};

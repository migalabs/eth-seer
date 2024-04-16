import { Request, Response } from 'express';
import { clickhouseClients } from '../config/db';

export const getEpochsStatistics = async (req: Request, res: Response) => {

    try {

        const { network, page = 0, limit = 10 } = req.query;

        const clickhouseClient = clickhouseClients[network as string];
        
        const skip = Number(page) * Number(limit);

        const [ epochsStatsResultSet, blocksStatsResultSet, epochsCountResultSet ] =
            await Promise.all([
                clickhouseClient.query({
                    query: `
                        SELECT
                            f_epoch,
                            f_slot,
                            f_num_att_vals,
                            f_num_active_vals,
                            f_att_effective_balance_eth,
                            f_total_effective_balance_eth,
                            f_missing_source,
                            f_missing_target,
                            f_missing_head
                        FROM
                            t_epoch_metrics_summary
                        ORDER BY
                            f_epoch DESC
                        LIMIT ${Number(limit)}
                        OFFSET ${skip}
                    `,
                    format: 'JSONEachRow',
                }),
                clickhouseClient.query({
                    query: `
                        SELECT
                            CAST((f_proposer_slot / 32) AS INT) AS epoch,
                            groupArray(f_proposed) AS proposed_blocks
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
                }),
                clickhouseClient.query({
                    query: `
                        SELECT COUNT(*) AS count
                        FROM t_epoch_metrics_summary
                    `,
                    format: 'JSONEachRow',
                }),
            ]);

        const epochsStatsResult: any[] = await epochsStatsResultSet.json();
        const blocksStatsResult: any[] = await blocksStatsResultSet.json();
        const epochsCountResult = await epochsCountResultSet.json();

        let arrayEpochs = [];

        epochsStatsResult.forEach((epoch: any) => { 
            const aux = blocksStatsResult.find((blocks: any) => blocks.epoch === epoch.f_epoch);
            arrayEpochs.push({  
                ...epoch, 
                ...aux,
            });
        });    
        
        res.json({
            epochsStats: arrayEpochs,
            totalCount: Number(epochsCountResult[0].count),
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server'
        });
    }
};

export const getEpochById = async (req: Request, res: Response) => {

    try {

        const { id } = req.params;
        const { network } = req.query;

        const clickhouseClient = clickhouseClients[network as string];

        const [ epochStatsResultSet, blocksProposedResultSet, withdrawalsResultSet ] =
            await Promise.all([
                clickhouseClient.query({
                    query: `
                        SELECT
                            f_epoch,
                            f_slot,
                            f_num_att_vals,
                            f_num_active_vals,
                            f_att_effective_balance_eth,
                            f_total_effective_balance_eth,
                            f_missing_source,
                            f_missing_target,
                            f_missing_head
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
                            CAST((f_proposer_slot / 32) AS INT) = ${id} AND f_proposed = 1
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
                            CAST((f_slot / 32) AS INT) = ${id}
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
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server'
        });
    }
};

export const getSlotsByEpoch = async (req: Request, res: Response) => {

    try {

        const { id } = req.params;
        const { network } = req.query;

        const clickhouseClient = clickhouseClients[network as string];

        const [ slotsEpochResultSet, withdrawalsResultSet ] =
            await Promise.all([
                clickhouseClient.query({
                    query: `
                        SELECT
                            pd.f_val_idx,
                            pd.f_proposer_slot,
                            pd.f_proposed,
                            pk.f_pool_name
                        FROM
                            t_proposer_duties pd
                        LEFT OUTER JOIN
                            t_eth2_pubkeys pk ON pd.f_val_idx = pk.f_val_idx
                        WHERE
                            CAST((pd.f_proposer_slot / 32) AS INT) = ${id}
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
                            CAST((f_slot / 32) AS INT) = ${id}
                    `,
                    format: 'JSONEachRow',
                }),
            ]);

        const slotsEpochResult: any[] = await slotsEpochResultSet.json();
        const withdrawalsResult: any[] = await withdrawalsResultSet.json();

        const slots = slotsEpochResult.map((slot: any) => ({
            ...slot,
            withdrawals: 
                withdrawalsResult
                    .filter((withdrawal: any) => withdrawal.f_slot === slot.f_proposer_slot)
                    .reduce((acc: number, withdrawal: any) => acc + Number(withdrawal.f_amount), 0),
        }));

        res.json({
            slots
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server'
        });
    }
};

export const listenEpochNotification = async (req: Request, res: Response) => {

    try {

        const { network } = req.query;

        const chClient = clickhouseClients[network as string];
        
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });

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

        const newEpochEstimatedTime = genesisTime + ((nextEpoch + 2) * 12000 * 32) + 4000;

        await new Promise((resolve) => setTimeout(resolve, newEpochEstimatedTime - Date.now()));

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

        res.write('event: new_epoch\n');
        res.write(`data: Epoch ${nextEpoch}`);
        res.write('\n\n');
        res.end();

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server'
        });
    }
};

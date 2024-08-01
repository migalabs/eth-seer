import { Request, Response } from 'express';
import { clickhouseClients } from '../config/db';

export const getSlots = async (req: Request, res: Response) => {
    try {
        const {
            network,
            page = 0,
            limit = 128,
            status,
            epoch,
            lowerEpoch,
            upperEpoch,
            validator,
            lowerDate,
            upperDate,
            entities,
            clients,
        } = req.query;

        const chClient = clickhouseClients[network as string];

        const skip = Number(page) * Number(limit);

        const where: string[] = [];

        if (status && typeof status === 'string') {
            if (status.toLowerCase() === 'proposed') {
                where.push('(pd.f_proposed = true) AND (o.f_slot IS NULL)');
            } else if (status.toLowerCase() === 'missed') {
                where.push('(pd.f_proposed = false) AND (o.f_slot IS NULL)');
            } else if (status.toLowerCase() === 'orphan') {
                where.push('(o.f_slot IS NOT NULL)');
            }
        }

        if (epoch) {
            where.push(`(pd.f_proposer_slot >= ${Number(epoch) * 32}) AND
                        (pd.f_proposer_slot < ${(Number(epoch) + 1) * 32})`);
        }

        if (lowerEpoch) {
            where.push(`(pd.f_proposer_slot >= ${Number(lowerEpoch) * 32})`);
        }

        if (upperEpoch) {
            where.push(`(pd.f_proposer_slot < ${(Number(upperEpoch) + 1) * 32})`);
        }

        if (validator) {
            where.push(`(pd.f_val_idx = ${Number(validator)})`);
        }

        if (lowerDate) {
            const minTime = new Date(lowerDate as string).getTime();
            where.push(`((g.f_genesis_time + pd.f_proposer_slot * 12) * 1000 >= ${minTime})`);
        }

        if (upperDate) {
            const maxTime = new Date(upperDate as string).getTime();
            where.push(`((g.f_genesis_time + pd.f_proposer_slot * 12) * 1000 < ${maxTime})`);
        }

        if (entities && Array.isArray(entities) && entities.length > 0) {
            const entitiesArray = entities
                .map(x => (typeof x === 'string' ? `'${x.toLowerCase()}'` : ''))
                .filter(x => x !== '');
            where.push(`(pk.f_pool_name IN (${entitiesArray.join(',')}))`);
        }

        if (clients && Array.isArray(clients) && clients.length > 0) {
            const clientsArray = clients
                .map(x => (typeof x === 'string' ? `'${x.toLowerCase()}'` : ''))
                .filter(x => x !== '');
            where.push(`(LOWER(scg.f_best_guess_single) IN (${clientsArray.join(',')}))`);
        }

        const [slotsResultSet, countResultSet] = await Promise.all([
            chClient.query({
                query: `
                        SELECT
                            pd.f_proposer_slot AS f_proposer_slot,
                            pd.f_val_idx AS f_val_idx,
                            pd.f_proposed AS f_proposed,
                            pk.f_pool_name AS f_pool_name,
                            COALESCE(SUM(w.f_amount), 0) AS withdrawals
                        FROM
                            t_proposer_duties pd
                        LEFT OUTER JOIN
                            t_eth2_pubkeys pk ON pd.f_val_idx = pk.f_val_idx
                        LEFT OUTER JOIN
                            t_withdrawals w ON pd.f_proposer_slot = w.f_slot
                        LEFT OUTER JOIN
                            t_orphans o ON pd.f_proposer_slot = o.f_slot
                        CROSS JOIN
                            t_genesis g
                        LEFT OUTER JOIN
                            t_slot_client_guesses scg ON pd.f_proposer_slot = scg.f_slot
                        ${where.length > 0 ? `WHERE ${where.join(' AND ')}` : ''}
                        GROUP BY
                            pd.f_proposer_slot, pd.f_val_idx, pd.f_proposed, pk.f_pool_name
                        ORDER BY
                            pd.f_proposer_slot DESC
                        LIMIT ${Number(limit)}
                        OFFSET ${skip}
                    `,
                format: 'JSONEachRow',
            }),
            chClient.query({
                query: `
                        SELECT
                            COUNT(*) AS count
                        FROM
                            t_proposer_duties pd
                        LEFT OUTER JOIN
                            t_eth2_pubkeys pk ON pd.f_val_idx = pk.f_val_idx
                        LEFT OUTER JOIN
                            t_orphans o ON pd.f_proposer_slot = o.f_slot
                        CROSS JOIN
                            t_genesis g
                        LEFT OUTER JOIN
                            t_slot_client_guesses scg ON pd.f_proposer_slot = scg.f_slot
                        ${where.length > 0 ? `WHERE ${where.join(' AND ')}` : ''}
                    `,
                format: 'JSONEachRow',
            }),
        ]);

        const slotsResult: any[] = await slotsResultSet.json();
        const countResult: any[] = await countResultSet.json();

        res.json({
            slots: slotsResult,
            totalCount: Number(countResult[0].count),
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server',
        });
    }
};

export const getBlocks = async (req: Request, res: Response) => {
    try {
        const { network, page = 0, limit = 128 } = req.query;

        const chClient = clickhouseClients[network as string];

        const skip = Number(page) * Number(limit);

        if (Number(page) > 0) {
            const blocksResultSet = await chClient.query({
                query: `
                    SELECT
                        CAST((pd.f_proposer_slot / 32) AS UInt64) AS f_epoch,
                        pd.f_proposer_slot AS f_slot,
                        pd.f_proposed,
                        pk.f_pool_name,
                        pd.f_val_idx AS f_proposer_index,
                        scg.f_best_guess_single AS f_cl_client
                    FROM
                        t_proposer_duties pd
                    LEFT OUTER JOIN
                        t_eth2_pubkeys pk ON pd.f_val_idx = pk.f_val_idx
                    LEFT OUTER JOIN
                        t_slot_client_guesses scg ON pd.f_proposer_slot = scg.f_slot
                    ORDER BY
                        pd.f_proposer_slot DESC
                    LIMIT ${Number(limit)}
                    OFFSET ${skip}
                `,
                format: 'JSONEachRow',
            });

            const blocksResult: any[] = await blocksResultSet.json();

            res.json({
                blocks: blocksResult,
            });
        } else {
            const [actualBlocksResultSet, finalBlocksResultSet] = await Promise.all([
                chClient.query({
                    query: `
                            SELECT
                                CAST((pd.f_proposer_slot / 32) AS UInt64) AS f_epoch,
                                pd.f_proposer_slot AS f_slot,
                                pd.f_proposed,
                                pk.f_pool_name,
                                pd.f_val_idx AS f_proposer_index,
                                scg.f_best_guess_single AS f_cl_client
                            FROM
                                t_proposer_duties pd
                            LEFT OUTER JOIN
                                t_eth2_pubkeys pk ON pd.f_val_idx = pk.f_val_idx
                            LEFT OUTER JOIN
                                t_slot_client_guesses scg ON pd.f_proposer_slot = scg.f_slot
                            ORDER BY
                                pd.f_proposer_slot DESC
                            LIMIT ${Number(limit)}
                            OFFSET ${skip}
                        `,
                    format: 'JSONEachRow',
                }),
                chClient.query({
                    query: `
                            SELECT
                                bm.f_epoch,
                                bm.f_slot AS f_slot,
                                pk.f_pool_name,
                                bm.f_proposed,
                                bm.f_proposer_index AS f_proposer_index,
                                bm.f_graffiti,
                                bm.f_el_block_number,
                                scg.f_best_guess_single AS f_cl_client
                            FROM
                                t_block_metrics bm
                            LEFT OUTER JOIN
                                t_eth2_pubkeys pk ON bm.f_proposer_index = pk.f_val_idx
                            LEFT OUTER JOIN
                                t_slot_client_guesses scg ON bm.f_slot = scg.f_slot
                            WHERE bm.f_epoch IN (
                                SELECT DISTINCT(f_epoch)
                                FROM t_block_metrics
                                ORDER BY f_epoch DESC
                                LIMIT 2
                            )
                            ORDER BY
                                bm.f_slot DESC
                        `,
                    format: 'JSONEachRow',
                }),
            ]);

            const actualBlocksResult: any[] = await actualBlocksResultSet.json();
            const finalBlocksResult: any[] = await finalBlocksResultSet.json();

            let arrayEpochs: any[] = [...actualBlocksResult, ...finalBlocksResult];

            res.json({
                blocks: arrayEpochs,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server',
        });
    }
};

export const getSlotById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { network } = req.query;

        const chClient = clickhouseClients[network as string];

        const [blockResultSet, proposerDutiesResultSet] = await Promise.all([
            chClient.query({
                query: `
                        SELECT
                            bm.f_timestamp,
                            bm.f_epoch,
                            bm.f_slot AS f_slot,
                            bm.f_graffiti,
                            bm.f_proposer_index AS f_proposer_index,
                            bm.f_proposed,
                            bm.f_attestations,
                            bm.f_deposits,
                            bm.f_proposer_slashings,
                            bm.f_voluntary_exits,
                            bm.f_sync_bits,
                            bm.f_el_fee_recp,
                            bm.f_el_gas_limit,
                            bm.f_el_gas_used,
                            bm.f_el_transactions,
                            bm.f_el_block_hash,
                            bm.f_el_block_number,
                            bm.f_attester_slashings AS f_att_slashings,
                            pk.f_pool_name,
                            scg.f_best_guess_single AS f_cl_client
                        FROM
                            t_block_metrics bm
                        LEFT OUTER JOIN
                            t_eth2_pubkeys pk ON bm.f_proposer_index = pk.f_val_idx
                        LEFT OUTER JOIN
                            t_slot_client_guesses scg ON bm.f_slot = scg.f_slot
                        WHERE
                            bm.f_slot = ${id}
                    `,
                format: 'JSONEachRow',
            }),
            chClient.query({
                query: `
                        SELECT
                            f_proposed
                        FROM
                            t_proposer_duties
                        WHERE
                            f_proposer_slot = ${id}
                    `,
                format: 'JSONEachRow',
            }),
        ]);

        const blockResult: any[] = await blockResultSet.json();
        const proposerDutiesResult: any[] = await proposerDutiesResultSet.json();

        if (blockResult.length > 0) {
            if (proposerDutiesResult.length > 0) {
                blockResult[0].f_proposed = proposerDutiesResult[0].f_proposed;
            }

            res.json({
                block: blockResult[0],
            });
        } else {
            res.json({});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server',
        });
    }
};

export const getSlotsByGraffiti = async (req: Request, res: Response) => {
    try {
        const { search } = req.params;
        const { network, page = 0, limit = 10 } = req.query;

        const skip = Number(page) * Number(limit);

        const chClient = clickhouseClients[network as string];

        const blocksResultSet = await chClient.query({
            query: `
                SELECT
                    bm.f_epoch,
                    bm.f_slot,
                    bm.f_graffiti,
                    bm.f_proposer_index,
                    bm.f_proposed,
                    pk.f_pool_name
                FROM
                    t_block_metrics bm
                LEFT OUTER JOIN
                    t_eth2_pubkeys pk ON bm.f_proposer_index = pk.f_val_idx
                WHERE
                    bm.f_graffiti LIKE '%${search}%'
                ORDER BY
                    bm.f_slot DESC
                LIMIT ${Number(limit)}
                OFFSET ${skip}
            `,
            format: 'JSONEachRow',
        });

        const blocksResult: any[] = await blocksResultSet.json();

        res.json({
            blocks: blocksResult,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server',
        });
    }
};

export const getWithdrawalsBySlot = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { network } = req.query;

        const chClient = clickhouseClients[network as string];

        const withdrawalsResultSet = await chClient.query({
            query: `
                SELECT
                    f_val_idx,
                    f_address,
                    f_amount
                FROM
                    t_withdrawals
                WHERE
                    f_slot = ${id}
            `,
            format: 'JSONEachRow',
        });

        const withdrawalsResult: any[] = await withdrawalsResultSet.json();

        res.json({
            withdrawals: withdrawalsResult,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server',
        });
    }
};

export const listenSlotNotification = async (req: Request, res: Response) => {
    try {
        const { network } = req.query;

        const chClient = clickhouseClients[network as string];

        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
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

        const nextSlot = Math.floor((Date.now() - genesisTime) / 12000) + 1;

        let latestSlotInserted = 0;
        let currentTimeout = 1000;

        do {
            if (latestSlotInserted > 0) {
                await new Promise(resolve => setTimeout(resolve, currentTimeout));
                currentTimeout *= 1.5;
            }

            const latestBlockResultSet = await chClient.query({
                query: `
                        SELECT
                            f_slot
                        FROM
                            t_block_metrics
                        ORDER BY
                            f_slot DESC
                        LIMIT 1
                    `,
                format: 'JSONEachRow',
            });

            const latestBlockResult: any[] = await latestBlockResultSet.json();

            latestSlotInserted = latestBlockResult.length > 0 ? latestBlockResult[0].f_slot : 0;
        } while (latestSlotInserted < nextSlot);

        res.write('event: new_slot\n');
        res.write(`data: Slot = ${latestSlotInserted}`);
        res.write('\n\n');
        res.end();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server',
        });
    }
};

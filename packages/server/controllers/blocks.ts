import { Request, Response } from 'express';
import { clickhouseClients } from '../config/db';

export const getBlocks = async (req: Request, res: Response) => {

    try {

        const { network, page = 0, limit = 32 } = req.query;

        const chClient = clickhouseClients[network as string];

        const skip = Number(page) * Number(limit);

        const [blocksResultSet, countResultSet] =
            await Promise.all([
                chClient.query({
                    query: `
                        SELECT
                            f_el_block_number,
                            f_el_block_hash,
                            f_timestamp,
                            f_slot,
                            f_epoch,
                            f_el_fee_recp,
                            f_el_gas_limit,
                            f_el_gas_used,
                            f_el_transactions,
                            f_payload_size_bytes
                        FROM t_block_metrics
                        WHERE f_el_block_number <> 0
                        ORDER BY f_el_block_number DESC
                        LIMIT ${Number(limit)}
                        OFFSET ${skip}
                    `,
                    format: 'JSONEachRow',
                }),
                chClient.query({
                    query: `
                        SELECT COUNT(*) AS count
                        FROM t_block_metrics
                        WHERE f_el_block_number <> 0
                    `,
                    format: 'JSONEachRow',
                }),
            ]);

        const blocksResult = await blocksResultSet.json();
        const countResult = await countResultSet.json();

        res.json({
            blocks: blocksResult,
            totalCount: Number(countResult[0].count),
        }); 
    
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server'
        });
    }
};

export const getBlockById = async (req: Request, res: Response) => {

    try {

        const { id } = req.params;
        const { network } = req.query;

        const chClient = clickhouseClients[network as string];

        const blockResultSet =
            await chClient.query({
                query: `
                    SELECT
                        f_el_block_number,
                        f_el_block_hash,
                        f_timestamp,
                        f_slot,
                        f_epoch,
                        f_el_fee_recp,
                        f_el_gas_limit,
                        f_el_gas_used,
                        f_el_transactions,
                        f_payload_size_bytes
                    FROM t_block_metrics
                    WHERE f_el_block_number = ${id}
                    LIMIT 1
                `,
                format: 'JSONEachRow',
            });

        const blockResult = await blockResultSet.json();

        res.json({
            block: blockResult[0],
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server'
        });
    }
};

export const getLatestBlock = async (req: Request, res: Response) => {

    try {

        const { network } = req.query;

        const chClient = clickhouseClients[network as string];

        const blockResultSet =
            await chClient.query({
                query: `
                    SELECT
                        f_el_block_number,
                        f_el_block_hash,
                        f_timestamp,
                        f_slot,
                        f_epoch,
                        f_el_fee_recp,
                        f_el_gas_limit,
                        f_el_gas_used,
                        f_el_transactions,
                        f_payload_size_bytes
                    FROM t_block_metrics
                    WHERE f_el_block_number <> 0
                    ORDER BY f_el_block_number DESC
                    LIMIT 1
                `,
                format: 'JSONEachRow',
            });

        const blockResult = await blockResultSet.json();

        res.json({
            block: blockResult[0],
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server'
        });
    }
};

export const getTransactionsByBlock = async (req: Request, res: Response) => {

    try {

        const { id } = req.params;
        const { network } = req.query;

        const chClient = clickhouseClients[network as string];

        const transactionsResultSet =
            await chClient.query({
                query: `
                    SELECT
                        f_tx_type,
                        f_value,
                        f_gas_fee_cap,
                        f_to,
                        f_hash,
                        f_timestamp,
                        f_from
                    FROM t_transactions
                    WHERE f_el_block_number = ${id}
                `,
                format: 'JSONEachRow',
            });

        const transactionsResult = await transactionsResultSet.json();

        res.json({
            transactions: transactionsResult,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server'
        });
    }
};
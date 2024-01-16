import { Request, Response } from 'express';
import { pgPools } from '../config/db';

export const getBlocks = async (req: Request, res: Response) => {

    try {

        const { network, page = 0, limit = 32 } = req.query;

        const pgPool = pgPools[network as string];

        const skip = Number(page) * Number(limit);

        const [ blocks, count ] = 
            await Promise.all([
                pgPool.query(`
                    SELECT f_timestamp, f_slot, f_epoch
                    f_el_fee_recp, f_el_gas_limit, f_el_gas_used,
                    f_el_transactions, f_el_block_hash, f_payload_size_bytes,
                    f_el_block_number
                    FROM t_block_metrics
                    WHERE f_el_block_number <> 0
                    ORDER BY f_el_block_number DESC
                    OFFSET ${skip}
                    LIMIT ${Number(limit)}
                `),
                pgPool.query(`
                    SELECT COUNT(*) AS count
                    FROM t_block_metrics
                    WHERE f_el_block_number <> 0
                `),
            ]);

        res.json({
            blocks: blocks.rows,
            totalCount: Number(count.rows[0].count),
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

        const pgPool = pgPools[network as string];

        const block = await pgPool.query(`
            SELECT f_el_block_number, f_timestamp, f_slot, f_epoch,
            f_el_fee_recp, f_el_gas_limit, f_el_gas_used,
            f_el_transactions, f_el_block_hash, f_payload_size_bytes
            FROM t_block_metrics
            WHERE f_el_block_number = '${id}'
            LIMIT 1
        `);

        res.json({
            block: block.rows[0],
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

        const pgPool = pgPools[network as string];

        const block = await pgPool.query(`
            SELECT f_el_block_number, f_timestamp, f_slot, f_epoch,
            f_el_fee_recp, f_el_gas_limit, f_el_gas_used,
            f_el_transactions, f_el_block_hash, f_payload_size_bytes
            FROM t_block_metrics
            ORDER BY f_el_block_number DESC
            LIMIT 1
        `);

        res.json({
            block: block.rows[0],
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

        const pgPool = pgPools[network as string];

        const transactions = 
            await pgPool.query(`
                SELECT f_tx_type,
                    f_value,
                    f_gas_fee_cap,
                    f_to,
                    f_hash,
                    f_timestamp, 
                    f_from
                FROM t_transactions
                WHERE f_el_block_number = '${id}'
            `);

        res.json({
            transactions: transactions.rows,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server'
        });
    }
};
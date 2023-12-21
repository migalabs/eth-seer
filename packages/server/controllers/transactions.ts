import { Request, Response } from 'express';
import { pgPools } from '../config/db';

export const getTransactions = async (req: Request, res: Response) => {

    try {
        
        const { network, page = 0, limit = 10 } = req.query;

        const pgPool = pgPools[network as string];

        const skip = Number(page) * Number(limit);

        const transactions = 
            await pgPool.query(`
                SELECT f_tx_idx, f_gas_fee_cap, f_value, f_to, f_hash, f_timestamp, f_from, f_el_block_number,
                f_gas_price, f_gas, f_tx_type, f_data
                FROM t_transactions
                ORDER by f_el_block_number DESC, f_tx_idx DESC, f_timestamp DESC
                OFFSET ${skip}
                LIMIT ${Number(limit)}
            `);

        res.json({
            transactions: transactions.rows
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server'
        });
    }
};

export const getTransactionByHash = async (req: Request, res: Response) => {

    try {
        
        const { hash } = req.params;

        const { network } = req.query;

        const pgPool = pgPools[network as string];

        const transaction = 
            await pgPool.query(`
                SELECT f_tx_idx, f_gas_fee_cap, f_value, f_to, f_hash, f_timestamp, f_from, f_el_block_number,
                f_gas_price, f_gas, f_tx_type, f_data, f_nonce
                FROM t_transactions
                WHERE f_hash = '${hash}'
            `);

        res.json({
            transaction: transaction.rows[0]
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server'
        });
    }
};
import { Request, Response } from 'express';
import { pgPools } from '../config/db';

export const getTransactions = async (req: Request, res: Response) => {

    try {
        
        const { network, page = 0, limit = 10 } = req.query;

        const pgPool = pgPools[network as string];

        const skip = Number(page) * Number(limit);

        const transactions = 
            await pgPool.query(`
                SELECT f_tx_idx, f_gas_fee_cap, f_value, f_to, f_hash, f_timestamp, f_from
                FROM t_transactions
                ORDER BY f_timestamp DESC
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

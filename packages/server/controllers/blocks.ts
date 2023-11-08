import { Request, Response } from 'express';
import { pgPools, pgListeners } from '../config/db';

export const getBlockById = async (req: Request, res: Response) => {

    try {

        const { id } = req.params;
        const { network } = req.query;

        const pgPool = pgPools[network as string];

        const [ block ] = 
            await Promise.all([
                pgPool.query(`
                    SELECT f_timestamp, f_slot, f_epoch
                    f_el_fee_recp, f_el_gas_limit, f_el_gas_used,
                    f_el_transactions, f_el_block_hash, f_payload_size_bytes
                    FROM t_block_metrics
                    WHERE f_el_block_number = '${id}'
                `)          
            ]);
        // 18022299
       
    
        res.json({
            block: {
                ...block.rows[0],
            },
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
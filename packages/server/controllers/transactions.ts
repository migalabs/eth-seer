import { Request, Response } from 'express';
import { clickhouseClients } from '../config/db';
import { ADDRESS_ZERO_SHORT } from '../helpers/address';

export const getTransactions = async (req: Request, res: Response) => {

    try {
        
        const { network, page = 0, limit = 10 } = req.query;

        const clickhouseClient = clickhouseClients[network as string];

        const skip = Number(page) * Number(limit);

        const transactionsResultSet = await clickhouseClient.query({
            query: `
                SELECT
                    f_tx_idx,
                    f_gas_fee_cap,
                    f_value,
                    f_to,
                    f_hash,
                    f_timestamp,
                    f_from,
                    f_el_block_number,
                    f_gas_price,
                    f_gas,
                    f_tx_type,
                    f_data
                FROM
                    t_transactions
                ORDER BY
                    f_slot DESC,
                    f_tx_idx DESC,
                    f_timestamp DESC
                LIMIT ${Number(limit)}
                OFFSET ${skip}
            `,
            format: 'JSONEachRow',
        });

        const transactionsResult: any[] = await transactionsResultSet.json();

        res.json({
            transactions: transactionsResult.map((tx: any) => ({
                ...tx,
                f_to: tx.f_to ?? ADDRESS_ZERO_SHORT,
            }))
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

        const clickhouseClient = clickhouseClients[network as string];

        const transactionResultSet = await clickhouseClient.query({
            query: `
                SELECT
                    f_tx_idx,
                    f_gas_fee_cap,
                    f_value,
                    f_to,
                    f_hash,
                    f_timestamp,
                    f_from,
                    f_el_block_number,
                    f_gas_price,
                    f_gas,
                    f_tx_type,
                    f_data,
                    f_nonce
                FROM
                    t_transactions
                WHERE
                    f_hash = '${hash}'
                LIMIT 1
            `,
            format: 'JSONEachRow',
        });

        const transactionResult = await transactionResultSet.json();

        if (!transactionResult[0]) {
            return res.json();
        }

        res.json({
            transaction: {
                ...transactionResult[0],
                f_to: transactionResult[0].f_to ?? ADDRESS_ZERO_SHORT,
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server'
        });
    }
};
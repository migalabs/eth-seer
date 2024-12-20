import { Request, Response } from 'express';
import { clickhouseClients } from '../config/db';

export const getSlashedVals = async (req: Request, res: Response) => {
    try {
        const { network, page = 0, limit = 10 } = req.query;

        const chClient = clickhouseClients[network as string];

        const skip = Number(page) * Number(limit);

        const [slashedValidatorResultSet, countResultSet] = await Promise.all([
            chClient.query({
                query: `
                        SELECT
                            sl.f_slashed_validator_index AS f_slashed_validator_index,
                            sl.f_slashed_by_validator_index AS f_slashed_by_validator_index,
                            sl.f_slashing_reason AS f_slashing_reason,
                            sl.f_slot AS f_slot,
                            sl.f_epoch AS f_epoch,
                            pk.f_pool_name AS f_slashed_validator_pool_name,
                            pk_by.f_pool_name AS f_slashed_by_validator_pool_name
                        FROM
                            t_slashings sl
                        LEFT OUTER JOIN
                            t_eth2_pubkeys pk ON f_slashed_validator_index = pk.f_val_idx
                        LEFT OUTER JOIN
                            t_eth2_pubkeys pk_by ON f_slashed_by_validator_index = pk_by.f_val_idx
                        ORDER BY
                            f_epoch DESC
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
                            t_slashings
                    `,
                format: 'JSONEachRow',
            }),
        ]);

        const slashedValidatorResult: any[] = await slashedValidatorResultSet.json();
        const countResult: any[] = await countResultSet.json();

        res.json({
            slashedValidator: slashedValidatorResult,
            totalCount: Number(countResult[0].count),
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server',
        });
    }
};

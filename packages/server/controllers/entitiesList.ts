import { Request, Response } from 'express';
import { clickhouseClients } from '../config/db';
import apicache from 'apicache';

let cache = apicache.middleware;

export const entityListCache = cache('1 hour');

export const getEntityList = async (req: Request, res: Response) => {
    try {
        const { network} = req.query;
        const chClient = clickhouseClients[network as string];

        const [entityListResultSet] = await Promise.all([
            chClient.query({
                query: `
                        SELECT DISTINCT
                            f_pool_name
                        FROM
                            t_eth2_pubkeys
                    `,
                format: 'JSONEachRow',
            }),

        ]);

        const entityListResult = await entityListResultSet.json();

        res.json({
            entityListResult: entityListResult,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server',
        });
    }
};

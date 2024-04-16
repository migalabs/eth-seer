import { Request, Response } from 'express';
import { clickhouseClients } from '../config/db';

export const getNetworks = async (req: Request, res: Response) => {

    try {
        const networksEnv = process.env.NETWORKS;

        if (!networksEnv) {
            throw new Error("NETWORKS environment variable not set");
        }

        const networksArray = JSON.parse(networksEnv);

        const networkNames = networksArray.map((networkObj: any) => networkObj.network);

        res.json({
            networks: networkNames
        });
        

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server'
        });
    }
};

export const getBlockGenesis = async (req: Request, res: Response) => {

    try {

        const { network } = req.query;

        const chClient = clickhouseClients[network as string];

        const blockGenesisResultSet = await chClient.query({
            query: `
                SELECT f_genesis_time
                FROM t_genesis
                LIMIT 1
            `,
            format: 'JSONEachRow',
        });

        const blockGenesisResult = await blockGenesisResultSet.json();
        
        res.json({
            block_genesis: Number(blockGenesisResult[0].f_genesis_time) * 1000
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server'
        });
    }
};

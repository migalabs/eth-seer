import { Request, Response } from 'express';
import { pgPools } from '../config/db';



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

        const pgPool = pgPools[network as string];

        const block_genesis  = 
            await pgPool.query(`
                    SELECT f_genesis_time
                    FROM t_genesis;
                `)
        
        res.json({
            block_genesis: Number(block_genesis.rows[0].f_genesis_time) * 1000
        });
        

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server'
        });
    }
};

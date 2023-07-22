import { Request, Response } from 'express';
import { pgClient, pgListener } from '../config/db';

export const getEpochsStatistics = async (req: Request, res: Response) => {

    try {

        const { page = 0, limit = 10 } = req.query;

        const skip = Number(page) * Number(limit);

        const [ epochsStats, blocksStats ] =
         await Promise.all([
            pgClient.query(`
                SELECT f_epoch, f_slot, f_num_att_vals, f_num_vals, 
                f_att_effective_balance_eth, f_total_effective_balance_eth,
                f_missing_source, f_missing_target, f_missing_head
                FROM t_epoch_metrics_summary
                ORDER BY f_epoch DESC
                OFFSET ${skip}
                LIMIT ${Number(limit)}
            `),
            pgClient.query(`
                SELECT (f_proposer_slot/32) AS epoch, 
                ARRAY_AGG(CASE WHEN f_proposed = true THEN 1 ELSE 0 END ORDER BY f_proposer_slot ASC) AS proposed_blocks
                FROM t_proposer_duties
                GROUP BY epoch
                ORDER BY epoch DESC
                OFFSET ${skip}
                LIMIT ${Number(limit)}
            `)
        ]);

        let arrayEpochs = [];

        epochsStats.rows.forEach((epoch: any) => { 
            const aux = blocksStats.rows.find((blocks: any) => blocks.epoch === epoch.f_epoch);
            arrayEpochs.push({  
                ...epoch, 
                ...aux,
            });
        });    
        
        res.json({
            epochsStats: arrayEpochs
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server'
        });
    }
};

export const getEpochById = async (req: Request, res: Response) => {

    try {

        const { id } = req.params;

        const [ epochStats, blocksProposed, withdrawals ] = 
            await Promise.all([
                pgClient.query(`
                    SELECT f_epoch, f_slot, f_num_att_vals, f_num_vals, 
                    f_att_effective_balance_eth, f_total_effective_balance_eth,
                    f_missing_source, f_missing_target, f_missing_head
                    FROM t_epoch_metrics_summary
                    WHERE f_epoch = '${id}'
                `),
                pgClient.query(`
                    SELECT COUNT(*) AS proposed_blocks
                    FROM t_proposer_duties
                    WHERE f_proposer_slot/32 = '${id}' AND f_proposed = true
                `),
                pgClient.query(`
                    SELECT SUM(f_amount) AS total_withdrawals
                    FROM t_withdrawals
                    WHERE f_slot/32 = '${id}'
                `),
            ]);

        res.json({
            epoch: {
                ...epochStats.rows[0],
                ...blocksProposed.rows[0],
                withdrawals: withdrawals.rows[0].total_withdrawals,
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server'
        });
    }
};

export const getSlotsByEpoch = async (req: Request, res: Response) => {

    try {

        const { id } = req.params;

        const [ slotsEpoch, withdrawals ] = 
            await Promise.all([
                pgClient.query(`
                    SELECT t_proposer_duties.*, t_eth2_pubkeys.f_pool_name
                    FROM t_proposer_duties
                    LEFT OUTER JOIN t_eth2_pubkeys ON t_proposer_duties.f_val_idx = t_eth2_pubkeys.f_val_idx
                    WHERE f_proposer_slot/32 = '${id}'
                    ORDER BY f_proposer_slot DESC
                `),
                pgClient.query(`
                    SELECT f_slot, f_amount
                    FROM t_withdrawals
                    WHERE f_slot/32 = '${id}'
                `)
            ]);

        const slots = slotsEpoch.rows.map((slot: any) => ({
            ...slot,
            withdrawals: 
                withdrawals.rows
                    .filter((withdrawal: any) => withdrawal.f_slot === slot.f_proposer_slot)
                    .reduce((acc: number, withdrawal: any) => acc + Number(withdrawal.f_amount), 0),
        }));

        res.json({
            slots
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server'
        });
    }
};

export const listenEpochNotification = async (req: Request, res: Response) => {

    try {

        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });

        pgListener.once('new_epoch_finalized', msg => {
            res.write('event: new_epoch\n');
            res.write(`data: ${msg.payload}`);
            res.write('\n\n');
            res.end();
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server'
        });
    }
};

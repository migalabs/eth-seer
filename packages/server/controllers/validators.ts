import { Request, Response } from 'express';
import { pgPools } from '../config/db';

export const getValidators = async (req: Request, res: Response) => {

    try {
        
        const { network, page = 0, limit = 10 } = req.query;

        const pgPool = pgPools[network as string];

        const skip = Number(page) * Number(limit);

        const [validators, count] = 
            await Promise.all([
                pgPool.query(`
                    SELECT t_validator_last_status.f_val_idx, t_validator_last_status.f_balance_eth, 
                    t_eth2_pubkeys.f_pool_name, t_status.f_status
                    FROM t_validator_last_status
                    LEFT OUTER JOIN t_eth2_pubkeys ON t_validator_last_status.f_val_idx = t_eth2_pubkeys.f_val_idx
                    LEFT OUTER JOIN t_status ON t_validator_last_status.f_status = t_status.f_id
                    ORDER BY t_validator_last_status.f_val_idx DESC
                    OFFSET ${skip}
                    LIMIT ${Number(limit)}
                `),
                pgPool.query(`
                    SELECT COUNT(*) AS count
                    FROM t_validator_last_status
                `),
            ]);

        res.json({
            validators: validators.rows,
            totalCount: Number(count.rows[0].count),
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server'
        });
    }
};

export const getValidatorById = async (req: Request, res: Response) => {

    try {

        const { id } = req.params;

        const { network, numberEpochs = 225 } = req.query;

        const pgPool = pgPools[network as string];

        const [ validatorStats, validatorPerformance ] = 
            await Promise.all([
                pgPool.query(`
                    SELECT t_validator_last_status.f_val_idx, t_validator_last_status.f_epoch, 
                    t_validator_last_status.f_balance_eth, t_eth2_pubkeys.f_pool_name, t_status.f_status
                    FROM t_validator_last_status
                    LEFT OUTER JOIN t_eth2_pubkeys ON t_validator_last_status.f_val_idx = t_eth2_pubkeys.f_val_idx
                    LEFT OUTER JOIN t_status ON t_validator_last_status.f_status = t_status.f_id
                    WHERE t_validator_last_status.f_val_idx = '${id}'
                `),
                pgPool.query(`
                WITH Last225Epochs AS (
                    SELECT MIN(f_epoch) as start_epoch, MAX(f_epoch) as end_epoch 
                    FROM (
                        SELECT f_epoch 
                        FROM t_validator_rewards_summary 
                        WHERE f_val_idx = '${id}'
                        ORDER BY f_epoch DESC
                        LIMIT ${Number(numberEpochs)}
                    ) AS sub
                )
                
                SELECT 
                    SUM(CASE WHEN f_status IN (1, 3) AND (f_reward <= f_max_reward) AND (f_reward > 0 ) THEN f_reward ELSE 0 END) as aggregated_rewards,
                    SUM(CASE WHEN f_status IN (1, 3) AND (f_reward <= f_max_reward) AND (f_reward > 0 ) THEN f_max_reward ELSE 0 END) as aggregated_max_rewards,
                    COUNT(CASE WHEN f_in_sync_committee = TRUE THEN 1 ELSE null END) as count_sync_committee,
                    COUNT(CASE WHEN f_missing_source = TRUE THEN 1 ELSE null END) as count_missing_source,
                    COUNT(CASE WHEN f_missing_target = TRUE THEN 1 ELSE null END) as count_missing_target,
                    COUNT(CASE WHEN f_missing_head = TRUE THEN 1 ELSE null END) as count_missing_head,
                    COUNT(CASE WHEN f_status IN (1, 3) THEN 1 ELSE 0 END) as count_attestations,
                    (
                        SELECT COUNT(CASE WHEN t_proposer_duties.f_proposed = TRUE THEN 1 ELSE null END)
                        FROM t_proposer_duties
                        WHERE t_proposer_duties.f_val_idx = '${id}'
                        AND t_proposer_duties.f_proposer_slot/32 BETWEEN (SELECT start_epoch FROM Last225Epochs) AND (SELECT end_epoch FROM Last225Epochs)
                    ) as proposed_blocks_performance,
                    (
                        SELECT COUNT(CASE WHEN t_proposer_duties.f_proposed = FALSE THEN 1 ELSE null END)
                        FROM t_proposer_duties
                        WHERE t_proposer_duties.f_val_idx = '${id}'
                        AND t_proposer_duties.f_proposer_slot/32 BETWEEN (SELECT start_epoch FROM Last225Epochs) AND (SELECT end_epoch FROM Last225Epochs)
                    ) as missed_blocks_performance
                FROM t_validator_rewards_summary
                LEFT JOIN t_proposer_duties 
                    ON t_validator_rewards_summary.f_val_idx = t_proposer_duties.f_val_idx 
                    AND t_validator_rewards_summary.f_epoch = t_proposer_duties.f_proposer_slot/32
                WHERE t_validator_rewards_summary.f_val_idx = '${id}'
                AND t_validator_rewards_summary.f_epoch BETWEEN (SELECT start_epoch FROM Last225Epochs) AND (SELECT end_epoch FROM Last225Epochs)
                GROUP BY t_validator_rewards_summary.f_val_idx;
                `),
            ]);

        let validator = null;

        if (validatorStats.rows.length > 0) {
            validator = {
                ...validatorStats.rows[0], 
                ...validatorPerformance.rows[0],
            };
        }

        res.json({
            validator
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server'
        });
    }
};

export const getValidatorStats = async (req: Request, res: Response) => {

    try {

        const { network } = req.query;

        const pgPool = pgPools[network as string];
        
        const stats = 
            await pgPool.query(`
                SELECT MIN(f_val_idx) AS first, MAX(f_val_idx) AS last, COUNT(DISTINCT(f_val_idx)) AS count
                FROM t_validator_last_status
            `);

        res.json({
            stats: stats.rows[0]
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server'
        });
    }
};

export const getLastValidator = async (req: Request, res: Response) => {
    
    try {

        const { network } = req.query;

        const pgPool = pgPools[network as string];
    
        const validator_idx = 
            await pgPool.query(`
                SELECT COUNT(*) as number_active_validators
                FROM t_validator_last_status
                LEFT OUTER JOIN t_status ON t_status.f_id = t_validator_last_status.f_status
                WHERE t_status.f_status = 'active'
            `);

        res.json({
            number_active_validators: validator_idx.rows[0].number_active_validators,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server'
        });
    }
}

export const getProposedBlocksByValidator = async (req: Request, res: Response) => {

    try {

        const { id } = req.params;
        const { network } = req.query;

        const pgPool = pgPools[network as string];

        const proposedBlocks = 
            await pgPool.query(`
                SELECT t_proposer_duties.f_val_idx, t_proposer_duties.f_proposer_slot, t_proposer_duties.f_proposed, 
                t_eth2_pubkeys.f_pool_name
                FROM t_proposer_duties
                LEFT OUTER JOIN t_eth2_pubkeys ON t_proposer_duties.f_val_idx = t_eth2_pubkeys.f_val_idx
                WHERE t_proposer_duties.f_val_idx = '${id}'
                ORDER BY t_proposer_duties.f_proposer_slot DESC
            `);

        res.json({
            proposedBlocks: proposedBlocks.rows
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server'
        });
    }
};

export const getWithdrawalsByValidator = async (req: Request, res: Response) => {

    try {

        const { id } = req.params;
        const { network } = req.query;

        const pgPool = pgPools[network as string];

        const withdrawals =
            await pgPool.query(`
                SELECT f_val_idx, f_slot/32 as f_epoch, f_slot, f_address, f_amount
                FROM t_withdrawals
                WHERE f_val_idx = '${id}'
                ORDER BY f_slot DESC
            `);

        res.json({
            withdrawals: withdrawals.rows
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'An error occurred on the server'
        });
    }
};

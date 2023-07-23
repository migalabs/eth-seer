import { Request, Response } from 'express';
import { pgPool } from '../config/db';

export const getValidatorById = async (req: Request, res: Response) => {

    try {

        const { id } = req.params;

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
                    SELECT 
                        SUM(CASE WHEN f_status IN (1, 3) AND (t_proposer_duties.f_proposed IS NULL OR t_proposer_duties.f_proposed = FALSE) THEN f_reward ELSE 0 END) as aggregated_rewards,
                        SUM(CASE WHEN f_status IN (1, 3) AND (t_proposer_duties.f_proposed IS NULL OR t_proposer_duties.f_proposed = FALSE) THEN f_max_reward ELSE 0 END) as aggregated_max_rewards,
                        COUNT(CASE WHEN f_in_sync_committee = TRUE THEN 1 ELSE null END) as count_sync_committee,
                        COUNT(CASE WHEN f_missing_source = TRUE THEN 1 ELSE null END) as count_missing_source,
                        COUNT(CASE WHEN f_missing_target = TRUE THEN 1 ELSE null END) as count_missing_target,
                        COUNT(CASE WHEN f_missing_head = TRUE THEN 1 ELSE null END) as count_missing_head,
                        COUNT(*) as count_attestations,
                        (
                            SELECT COUNT(CASE WHEN t_proposer_duties.f_proposed = TRUE THEN 1 ELSE null END)
                            FROM t_proposer_duties
                            WHERE t_proposer_duties.f_val_idx = '${id}'
                                AND t_proposer_duties.f_proposer_slot/32 BETWEEN MIN(t_validator_rewards_summary.f_epoch) AND MAX(t_validator_rewards_summary.f_epoch)
                        ) as proposed_blocks_performance,
                        (
                            SELECT COUNT(CASE WHEN t_proposer_duties.f_proposed = FALSE THEN 1 ELSE null END)
                            FROM t_proposer_duties
                            WHERE t_proposer_duties.f_val_idx = '${id}'
                                AND t_proposer_duties.f_proposer_slot/32 BETWEEN MIN(t_validator_rewards_summary.f_epoch) AND MAX(t_validator_rewards_summary.f_epoch)
                        ) as missed_blocks_performance
                    FROM t_validator_rewards_summary
                    LEFT JOIN t_proposer_duties 
                        ON t_validator_rewards_summary.f_val_idx = t_proposer_duties.f_val_idx 
                        AND t_validator_rewards_summary.f_epoch = t_proposer_duties.f_proposer_slot/32
                    WHERE t_validator_rewards_summary.f_val_idx = '${id}'
                    GROUP BY t_validator_rewards_summary.f_val_idx;
                `),
            ]);

        res.json({
            validator: {
                ...validatorStats.rows[0], 
                ...validatorPerformance.rows[0],
            }
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

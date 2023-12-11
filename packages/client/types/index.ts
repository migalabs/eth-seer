export type Epoch = {
    f_epoch: number;
    f_slot: number;
    f_num_att_vals: number;
    f_num_vals: number;
    f_att_effective_balance_eth: number;
    f_total_effective_balance_eth: number;
    f_missing_source: number;
    f_missing_target: number;
    f_missing_head: number;
    proposed_blocks: Array<number>;
    withdrawals?: number;
};

export type Validator = {
    f_val_idx: number;
    f_pool_name: string;
    f_balance_eth: number;
    f_status: string;
    aggregated_rewards: number;
    aggregated_max_rewards: number;
    count_sync_committee: number;
    count_missing_source: number;
    count_missing_target: number;
    count_missing_head: number;
    count_attestations: number;
    proposed_blocks_performance: number;
    missed_blocks_performance: number;
};

export type Block = {
    f_slot: number;
    f_pool_name?: string;
    f_proposed?: boolean;
    f_epoch: number;
    f_proposer_index?: number;
    f_graffiti?: string;
    f_att_slashings?: number;
    f_attestations?: number;
    f_deposits?: number;
    f_el_block_number?: number;
    f_el_block_hash?: string;
    f_el_fee_recp?: string;
    f_el_gas_limit?: number;
    f_el_gas_used?: number;
    f_el_transactions?: number;
    f_proposer_slashings?: number;
    f_sync_bits?: number;
    f_timestamp: number;
    f_voluntary_exits?: number;
};

export type BlockEL = {
    f_epoch: number;
    f_slot: number;
    f_timestamp: number;
    f_el_block_number?: number;
    f_el_block_hash?: string;
    f_el_fee_recp?: string;
    f_el_gas_limit?: number;
    f_el_gas_used?: number;
    f_el_transactions?: number;
    f_payload_size_bytes?: string;
};

export type Slot = {
    f_proposer_slot: number;
    f_pool_name: string;
    f_val_idx: number;
    f_proposed: boolean;
    f_epoch?: number;
    withdrawals: number;
};

export type Withdrawal = {
    f_epoch?: number;
    f_slot?: number;
    f_val_idx: number;
    f_amount: number;
    f_address?: string;
};

export type Transaction = {
    f_tx_idx: number;
    f_value: number;
    f_gas_fee_cap: number;
    f_to: string;
    f_hash: string;
    f_timestamp: number;
    f_from: string;
    f_tx_type: number;
    f_el_block_number: number;
    f_gas_price: number;
    f_gas: number;
    f_data: string;
    f_nonce: number;
};

export type Proposed = {
    f_proposed: number;
    f_missed: number;
};

export type Entity = {
    aggregate_balance: number;
    deposited: number;
    active: number;
    slashed: number;
    exited: number;
    proposed_blocks: Proposed;
    aggregated_rewards: number;
    aggregated_max_rewards: number;
    count_sync_committee: number;
    count_missing_source: number;
    count_missing_target: number;
    count_missing_head: number;
    count_expected_attestations: number;
    proposed_blocks_performance: number;
    missed_blocks_performance: number;
};

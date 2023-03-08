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
    reward_average: string;
    max_reward_average: string;
    proposed_blocks: Array<number>;
    f_slots?: Array<Slot>;
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
    f_el_base_fee_per_gas?: number;
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

export type Slot = {
    f_proposer_slot: number;
    f_pool_name: string;
    f_val_idx: number;
    f_proposed: boolean;
};

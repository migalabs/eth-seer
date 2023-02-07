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
};

export type Block = {
    f_slot: number;
    f_pool_name: string;
    f_proposed: boolean;
    f_epoch: number;
    f_proposer_index: number;
    f_graffiti: string;
};

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axiosClient from '../../config/axios';

type Props = {
    title: string;
    content: string | number | boolean;
};

const Card = (props: Props) => {
    const { title, content } = props;
    return (
        <div className='flex flex-1 p-4'>
            <div className='bg-[#A7EED4] rounded-[22px] px-2  py-3'>
                <p>{title}: </p>
            </div>
            <p className='px-2  py-3'>{content}</p>
        </div>
    );
};

type Block = {
    f_slot: number;
    f_proposed: boolean;
    f_epoch: number;
    f_proposer_index: number;
    f_graffiti: string;
    f_att_slashings: number;
    f_attestations: number;
    f_deposits: number;
    f_el_base_fee_per_gas: number;
    f_el_block_hash: string;
    f_el_fee_recp: string;
    f_el_gas_limit: number;
    f_el_gas_used: number;
    f_el_transactions: number;
    f_proposer_slashings: number;
    f_sync_bits: number;
    f_timestamp: number;
    f_voluntary_exits: number;
};

const BlockComponet = () => {
    // Next router
    const router = useRouter();
    const {
        query: { id },
    } = router;

    // States
    const [block, setBlock] = useState<Block | null>(null);

    // UseEffect
    useEffect(() => {
        if (id && block === null) {
            getBlock();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // Get blocks
    const getBlock = async () => {
        try {
            console.log('res: ', id);
            const response = await axiosClient.get(`/api/validator-rewards-summary/block/${id}`);
            const blockResponse: Block = response.data.row;
            setBlock(blockResponse);
            console.log(blockResponse);
        } catch (error) {
            console.log(error);
        }
    };

    const addContent = (block: Block) => {
        return (
            <div
                className='flex flex-col w-fit md:max-h-full  mx-auto mb-10 gap-2 text-[16px] bg-[#A7EED466] rounded-[22px] px-2 py-3'
                style={{ boxShadow: 'inset -7px -7px 8px #A7EED4, inset 7px 7px 8px #A7EED4' }}
            >
                <Card title='Epoch' content={block.f_epoch} />
                <Card title='Slot' content={block.f_slot} />
                <Card title='Graffiti' content={block.f_graffiti} />
                <Card title='Att. slashings' content={block.f_att_slashings} />
                <Card title='Attestations' content={block.f_attestations} />
                <Card title='Deposits' content={block.f_deposits} />
                <Card title='Base fee per gas' content={block.f_el_base_fee_per_gas} />
                <Card title='Block hash' content={block.f_el_block_hash} />
                <Card title='Fee recp.' content={block.f_el_fee_recp} />
                <Card title='Gas limit' content={block.f_el_gas_limit} />
                <Card title='Gas used' content={block.f_el_gas_used} />
                <Card title='Transaction' content={block.f_el_transactions} />
                <Card title='Proposed' content={block.f_proposed === true ? 'proposed' : 'missed'} />
                <Card title='Proposer Index' content={block.f_proposer_index} />
                <Card title='Proposer slashings' content={block.f_proposer_slashings} />
                <Card title='Sync bits' content={block.f_sync_bits} />
                <Card title='Timestamp' content={block.f_timestamp} />
                <Card title='Voluntary exits' content={block.f_voluntary_exits} />
            </div>
        );
    };

    return (
        <>
            <h1 className='text-white text-center'>Slot {id}</h1>

            {block && addContent(block)}
        </>
    );
};

export default BlockComponet;

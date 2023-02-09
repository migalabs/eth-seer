import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

// Axios
import axiosClient from '../../config/axios';

// Components
import Layout from '../../components/layouts/Layout';

// Types
import { Block } from '../../types';

type Props = {
    title: string;
    content: string | number | boolean;
    icon?: string;
    iconSize?: number;
    canCopy?: boolean;
};

const Card = ({ title, content, icon, iconSize, canCopy }: Props) => {
    return (
        <div className='flex gap-3 items-center'>
            <div className='bg-[#A7EED4] rounded-2xl px-2 py-3 w-40 md:w-[21rem]'>
                <p className='uppercase text-[#29C68E] text-center text-[10px] md:text-base'>{title}</p>
            </div>
            <div className='flex gap-1 items-center'>
                <p className='uppercase text-white text-[8px] md:text-sm'>{content}</p>
                {icon && (
                    <Image
                        src={`/static/images/${icon}.svg`}
                        width={iconSize || 35}
                        height={iconSize || 35}
                        alt='Icon'
                        className={canCopy ? 'cursor-pointer' : ''}
                    />
                )}
            </div>
        </div>
    );
};

const BlockComponet = () => {
    // Next router
    const router = useRouter();
    const {
        query: { id },
    } = router;

    // States
    const [block, setBlock] = useState<Block | null>(null);
    const [isPhoneView, setIsPhoneView] = useState<boolean>(true);

    // UseEffect
    useEffect(() => {
        if (id && !block) {
            getBlock();
        }

        if (window !== undefined) {
            setIsPhoneView(window.innerWidth <= 768);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // Get blocks
    const getBlock = async () => {
        try {
            const response = await axiosClient.get(`/api/validator-rewards-summary/block/${id}`);
            const blockResponse: Block = response.data.row;
            setBlock(blockResponse);
        } catch (error) {
            console.log(error);
        }
    };

    // Get Short Address
    const getShortAddress = (address: string) => {
        console.log('getShortAddress -> address', address);
        return `${address.slice(0, 6)}...${address.slice(address.length - 6, address.length)}`;
    };

    return (
        <Layout>
            <h1 className='text-white text-center text-xl md:text-3xl'>Slot {id}</h1>

            {block && (
                <div
                    className='flex flex-col w-fit md:max-h-full mx-2 md:mx-auto mt-4 mb-10 gap-y-5 bg-[#A7EED466] rounded-[22px] p-4 md:p-8'
                    style={{ boxShadow: 'inset -7px -7px 8px #A7EED4, inset 7px 7px 8px #A7EED4' }}
                >
                    <Card title='Epoch' content={block.f_epoch.toLocaleString()} icon='copy-icon' canCopy />
                    <Card title='Slot' content={block.f_slot.toLocaleString()} icon='copy-icon' canCopy />
                    <Card title='Graffiti' content={block.f_graffiti} />
                    <Card title='Att. slashings' content={block.f_att_slashings.toLocaleString()} />
                    <Card title='Attestations' content={block.f_attestations.toLocaleString()} />
                    <Card title='Deposits' content={block.f_deposits.toLocaleString()} />
                    <Card title='Base fee per gas' content={block.f_el_base_fee_per_gas.toLocaleString()} />
                    <Card
                        title='Block hash'
                        content={isPhoneView ? getShortAddress(block.f_el_block_hash) : block.f_el_block_hash}
                        icon='copy-icon'
                        canCopy
                    />
                    <Card
                        title='Fee recp.'
                        content={isPhoneView ? getShortAddress(block.f_el_fee_recp) : block.f_el_fee_recp}
                        icon='copy-icon'
                        canCopy
                    />
                    <Card title='Gas limit' content={block.f_el_gas_limit.toLocaleString()} />
                    <Card title='Gas used' content={block.f_el_gas_used.toLocaleString()} />
                    <Card title='Transaction' content={block.f_el_transactions.toLocaleString()} />
                    <Card title='Proposed' content={block.f_proposed === true ? 'proposed' : 'missed'} />
                    <Card
                        title='Proposer Index'
                        content={block.f_proposer_index.toLocaleString()}
                        icon='proposer-icon'
                        iconSize={40}
                    />
                    <Card title='Proposer slashings' content={block.f_proposer_slashings.toLocaleString()} />
                    <Card title='Sync bits' content={block.f_sync_bits.toLocaleString()} />
                    <Card title='Timestamp' content={block.f_timestamp} />
                    <Card title='Voluntary exits' content={block.f_voluntary_exits.toLocaleString()} />
                </div>
            )}
        </Layout>
    );
};

export default BlockComponet;

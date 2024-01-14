import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// Axios
import axiosClient from '../../config/axios';

// Hooks
import useLargeView from '../../hooks/useLargeView';

// Components
import LinkBlock from '../ui/LinkBlock';
import LinkSlot from '../ui/LinkSlot';
import { LargeTable, LargeTableHeader, LargeTableRow, SmallTable, SmallTableCard } from '../ui/Table';

// Types
import { BlockEL } from '../../types';

// Props
type Props = {
    blocks: BlockEL[];
    fetchingBlocks?: boolean;
};

const Blocks = ({ blocks, fetchingBlocks }: Props) => {
    // Router
    const router = useRouter();
    const { network } = router.query;

    // Large View Hook
    const isLargeView = useLargeView();

    // States
    const [blockGenesis, setBlockGenesis] = useState(0);

    useEffect(() => {
        if (network && blockGenesis == 0) {
            getBlockGenesis(network as string);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getBlockGenesis = async (network: string) => {
        try {
            const genesisBlock = await axiosClient.get(`/api/networks/block/genesis`, {
                params: {
                    network,
                },
            });

            setBlockGenesis(genesisBlock.data.block_genesis);
        } catch (error) {
            console.log(error);
        }
    };

    //View blocks table desktop
    const getContentBlocksDesktop = () => (
        <LargeTable minWidth={600} noRowsText='No Blocks' fetchingRows={fetchingBlocks}>
            <LargeTableHeader text='Block' />
            <LargeTableHeader text='Slot' />
            <LargeTableHeader text='Time' />
            <LargeTableHeader text='Transactions' />

            {blocks.map(block => (
                <LargeTableRow key={block.f_el_block_number}>
                    <div className='w-[25%]'>
                        <LinkBlock block={block.f_el_block_number} mxAuto />
                    </div>

                    <div className='w-[25%]'>
                        <LinkSlot slot={block.f_slot} mxAuto />
                    </div>

                    <div className='w-[25%] flex flex-col'>
                        <span>{new Date(block.f_timestamp * 1000).toLocaleDateString('ja-JP')}</span>
                        <span>{new Date(block.f_timestamp * 1000).toLocaleTimeString('ja-JP')}</span>
                    </div>

                    <p className='w-[25%]'>{(block.f_el_transactions ?? 0).toLocaleString()}</p>
                </LargeTableRow>
            ))}
        </LargeTable>
    );

    //View blocks table mobile
    const getContentBlocksMobile = () => (
        <SmallTable noRowsText='No Blocks' fetchingRows={fetchingBlocks}>
            {blocks.map(block => (
                <SmallTableCard key={block.f_slot}>
                    <div className='flex w-full items-center justify-between'>
                        <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>Block:</p>
                        <LinkBlock block={block.f_el_block_number} />
                    </div>

                    <div className='flex w-full items-center justify-between'>
                        <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>Slot:</p>
                        <LinkSlot slot={block.f_slot} />
                    </div>

                    <div className='flex w-full items-center justify-between'>
                        <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>Time</p>

                        <div className='flex flex-col text-end'>
                            <span>{new Date(block.f_timestamp * 1000).toLocaleDateString('ja-JP')}</span>
                            <span>{new Date(block.f_timestamp * 1000).toLocaleTimeString('ja-JP')}</span>
                        </div>
                    </div>

                    <div className='flex w-full items-center justify-between'>
                        <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>Transactions:</p>
                        <p>{(block.f_el_transactions ?? 0).toLocaleString()}</p>
                    </div>
                </SmallTableCard>
            ))}
        </SmallTable>
    );

    return <>{isLargeView ? getContentBlocksDesktop() : getContentBlocksMobile()}</>;
};

export default Blocks;

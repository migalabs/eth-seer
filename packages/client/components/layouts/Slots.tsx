import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// Axios
import axiosClient from '../../config/axios';

// Hooks
import useLargeView from '../../hooks/useLargeView';

// Components
import LinkValidator from '../../components/ui/LinkValidator';
import LinkSlot from '../../components/ui/LinkSlot';
import LinkEntity from '../../components/ui/LinkEntity';
import BlockState from '../ui/BlockState';
import { LargeTable, LargeTableHeader, LargeTableRow, SmallTable, SmallTableCard } from '../ui/Table';
import TooltipResponsive from '../ui/TooltipResponsive';


// Types
import { Slot } from '../../types';
import { getShortAddress } from '../../helpers/addressHelper';

// Props
type Props = {
    slots: Slot[];
    fetchingSlots?: boolean;
};

const Slots = ({ slots, fetchingSlots }: Props) => {
    // Router
    const router = useRouter();
    const { network } = router.query;

    // Large View Hook
    const isLargeView = useLargeView();

    // States
    const [blockGenesis, setBlockGenesis] = useState(0);

    useEffect(() => {
        if (network && blockGenesis === 0) {
            getBlockGenesis(network as string);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [network]);

    const getBlockGenesis = async (network: string) => {
        try {
            const genesisBlock = await axiosClient.get('/api/networks/block/genesis', {
                params: {
                    network,
                },
            });

            setBlockGenesis(genesisBlock.data.block_genesis);
        } catch (error) {
            console.log(error);
        }
    };

    // Slots Large View
    const getContentSlotsLargeView = () => (
        <LargeTable minWidth={850} noRowsText='No Slots' fetchingRows={fetchingSlots}>
            <LargeTableHeader text='Block' width='11%' />
            <LargeTableHeader text='Entity' width='25%' />
            <LargeTableHeader text='Proposer' width='12%' />
            <LargeTableHeader text='Slot' width='12%' />
            <LargeTableHeader text='Time' width='10%' />
            <LargeTableHeader text='Root Hash' width='15%' />
            <LargeTableHeader text='Att' width='10%' tooltipContent={
                    <TooltipResponsive
                        width={220}
                        content={
                            <>
                                <span>Attestations included in slot</span>
                            </>
                        }
                        top='34px'
                    />
                }/>
            <LargeTableHeader text='Sync Agg %' width='15%' tooltipContent={
                    <TooltipResponsive
                        width={220}
                        content={
                            <>
                                <span>Sync Aggregate Participation</span>
                            </>
                        }
                        top='34px'
                    />
                }/>

            <LargeTableHeader text='Deposits' width='10%' />
            <LargeTableHeader text='S- P / A' width='10%' tooltipContent={
                    <TooltipResponsive
                        width={220}
                        content={
                            <>
                                <span>Slashings Proposer / Attester</span>
                            </>
                        }
                        top='34px'
                    />
                }/>
            <LargeTableHeader text='Exits' width='10%' />
            <LargeTableHeader text='Withdrawals' width='15%' />

            {slots.map(slot => (
                <LargeTableRow key={slot.f_proposer_slot}>
                    <div className='w-[11%] flex items-center justify-center'>
                        <BlockState
                            poolName={slot.f_pool_name}
                            proposed={slot.f_proposed}
                            width={80}
                            height={80}
                            showCheck
                        />
                    </div>

                    <div className='w-[25%] uppercase md:hover:underline underline-offset-4 decoration-2 text-[var(--darkPurple)] dark:text-[var(--purple)]'>
                        <LinkEntity entity={slot.f_pool_name} mxAuto />
                    </div>

                    <div className='w-[12%] md:hover:underline underline-offset-4 decoration-2 text-[var(--darkPurple)] dark:text-[var(--purple)]'>
                        <LinkValidator validator={slot.f_val_idx} mxAuto />
                    </div>

                    <div className='w-[12%] md:hover:underline underline-offset-4 decoration-2 text-[var(--darkPurple)] dark:text-[var(--purple)]'>
                        <LinkSlot slot={slot.f_proposer_slot} mxAuto />
                    </div>

                    <div className='w-[10%] flex flex-col text-center'>
                        <span>
                            {new Date(blockGenesis + Number(slot.f_proposer_slot) * 12000).toLocaleDateString('ja-JP')}
                        </span>
                        <span>
                            {new Date(blockGenesis + Number(slot.f_proposer_slot) * 12000).toLocaleTimeString('ja-JP')}
                        </span>
                    </div>

                    <p className='w-[15%] text-center'>{(slot.f_block) ? getShortAddress(slot.f_block) : "N/A"}</p>

                    <p className='w-[10%] text-center'>{slot.f_attestations}</p>

                    <p className='w-[15%] text-center'>{(slot.f_sync_bits * 100 / 512).toFixed(2)}%</p>

                    <p className='w-[10%] text-center'>{slot.f_deposits}</p>

                    <p className='w-[10%] text-center'>{slot.f_proposer_slashings}/{slot.f_attester_slashings}</p>

                    <p className='w-[10%] text-center'>{slot.f_voluntary_exits}</p>

                    <p className='w-[15%] text-center'>{slot.withdrawals}({(slot.withdrawals / 10 ** 9).toLocaleString()}) ETH</p>
                </LargeTableRow>
            ))}
        </LargeTable>
    );

    // Slots Small View
    const getContentSlotsSmallView = () => (
        <SmallTable noRowsText='No Slots' fetchingRows={fetchingSlots}>
            {slots.map(slot => (
                <SmallTableCard key={slot.f_proposer_slot}>
                    <div className='flex items-center justify-between w-full'>
                        <BlockState
                            poolName={slot.f_pool_name}
                            proposed={slot.f_proposed}
                            width={80}
                            height={80}
                            showCheck
                        />

                        <div className='flex flex-col'>
                            <div className='flex items-center justify-between py-1'>
                                <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>Slot:</p>
                                <LinkSlot slot={slot.f_proposer_slot} />
                            </div>

                            <div className='flex items-center justify-between gap-x-14 py-1'>
                                <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>
                                    Proposer:
                                </p>
                                <LinkValidator validator={slot.f_val_idx} />
                            </div>

                            <div className='flex items-center justify-between py-1'>
                                <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>Time:</p>
                                <div className='flex flex-col text-end'>
                                    <p>
                                        {new Date(
                                            blockGenesis + Number(slot.f_proposer_slot) * 12000
                                        ).toLocaleDateString('ja-JP')}
                                    </p>
                                    <p>
                                        {new Date(
                                            blockGenesis + Number(slot.f_proposer_slot) * 12000
                                        ).toLocaleTimeString('ja-JP')}
                                    </p>
                                </div>
                            </div>

                            <div className='flex items-center justify-between'>
                                <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>
                                    Root Hash:
                                </p>
                                <p>{(slot.f_block) ? getShortAddress(slot.f_block) : "N/A"}</p>
                            </div>

                            <div className='flex items-center justify-between'>
                                <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>
                                    Attestations:
                                </p>
                                <p>{slot.f_attestations}</p>
                            </div>

                            <div className='flex items-center justify-between'>
                                <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>
                                    Sync Agg %:
                                </p>
                                <p>{(slot.f_sync_bits * 100 / 512).toFixed(2)}%</p>
                            </div>

                            <div className='flex items-center justify-between'>
                                <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>
                                    Deposits:
                                </p>
                                <p>{slot.f_deposits}</p>
                            </div>

                            <div className='flex items-center justify-between'>
                                <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>
                                    Slashing P / A:
                                </p>
                                <p>{slot.f_proposer_slashings}/{slot.f_attester_slashings}</p>
                            </div>

                            <div className='flex items-center justify-between'>
                                <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>
                                    Exits:
                                </p>
                                <p>{slot.f_voluntary_exits}</p>
                            </div>

                            <div className='flex items-center justify-between'>
                                <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>
                                    Withdrawals:
                                </p>
                                <p>{(slot.withdrawals / 10 ** 9).toLocaleString()} ETH</p>
                            </div>
                        </div>
                    </div>
                </SmallTableCard>
            ))}
        </SmallTable>
    );

    return <>{isLargeView ? getContentSlotsLargeView() : getContentSlotsSmallView()}</>;
};

export default Slots;

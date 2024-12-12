import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import axiosClient from '../../config/axios';

// Hooks
import useLargeView from '../../hooks/useLargeView';

// Components
import LinkValidator from '../ui/LinkValidator';
import LinkSlot from '../ui/LinkSlot';
import LinkEntity from '../ui/LinkEntity';
import LinkEpoch from '../ui/LinkEpoch';
import { LargeTable, LargeTableHeader, LargeTableRow, SmallTable, SmallTableCard } from '../ui/Table';
import TooltipContainer from '../ui/TooltipContainer';
import TooltipResponsive from '../ui/TooltipResponsive';

// Types
import { SlashedVal } from '../../types';

// Props
type Props = {
    slashedVals: SlashedVal[];
};

const Age = (timestampDay: any) => {
    const slashedDate: any = new Date(timestampDay);
    const todaysDate:any = new Date();
    const difference = todaysDate - slashedDate;
    const Hours = Math.floor(difference / (1000 * 60 * 60));
    const Days = Math.floor(Hours / 24);
    const remainingHours = Hours % 24;

    const age = `${Days} days ${remainingHours} hours ago`;
    return age;
}

const SlashedVals = ({slashedVals}: Props) => {
    // Large View Hook
    const router = useRouter();
    const { network } = router.query;

    const isLargeView = useLargeView();
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
    // SLashed Validators Large View
    const getContentSlashedValsLargeView = () => (
        <LargeTable
        minWidth={1150}
        noRowsText='No Slashed Validators'
        fetchingRows={false}
        showRowsWhileFetching={false}>
            <LargeTableHeader text='Slashed Validators' width='20%' />
            <LargeTableHeader text='Slashed by' width='20%' />
            <LargeTableHeader text='Time' width='10%' />
            <LargeTableHeader text='Reason' width='15%' />
            <LargeTableHeader text='Slot' width='15%' />
            <LargeTableHeader text='Epoch' width='15%' />

            {slashedVals.map(slashedVals => (
                <LargeTableRow key={slashedVals.f_slashed_validator_index}>

                    <div className='w-[20%] flex justify-center items-center gap-3'>
                        <div className=' md:hover:underline underline-offset-4 decoration-2 text-[var(--darkPurple)] dark:text-[var(--purple)]'>
                            <LinkValidator validator={slashedVals.f_slashed_validator_index} mxAuto />
                        </div>
                        <div className='flex gap-1'>
                            <span>(</span>
                            <div className=' md:hover:underline underline-offset-4 decoration-2 text-[var(--darkPurple)] dark:text-[var(--purple)]'>
                                <LinkEntity entity={slashedVals.f_slashed_validator_pool_name} mxAuto />
                            </div>
                            <span>)</span>
                        </div>
                    </div>
                    
                    <div className='w-[20%] flex justify-center items-center gap-3'>
                        <div className=' md:hover:underline underline-offset-4 decoration-2 text-[var(--darkPurple)] dark:text-[var(--purple)]'>
                            <LinkValidator validator={slashedVals.f_slashed_by_validator_index} mxAuto />
                        </div>
                        <div className='flex gap-1'>
                            <span>(</span>
                            <div className=' md:hover:underline underline-offset-4 decoration-2 text-[var(--darkPurple)] dark:text-[var(--purple)]'>
                                <LinkEntity entity={slashedVals.f_slashed_by_validator_pool_name} mxAuto />
                            </div>
                            <span>)</span>
                        </div>
                    </div>

                    <div className='w-[10%] flex flex-col pt-2.5 pb-2.5'>
                        <TooltipContainer>
                            <div>
                                <p>{Age(blockGenesis + slashedVals.f_slot * 12000)}</p>
                            </div>
                            <TooltipResponsive
                            width={120}
                            content={
                                <>
                                    <p>{new Date(blockGenesis + slashedVals.f_slot * 12000).toLocaleDateString('ja-JP')}</p>
                                    <p>{new Date(blockGenesis + slashedVals.f_slot * 12000).toLocaleTimeString('ja-JP')}</p>
                                </>
                            }
                            top='34px'
                            polygonCenter
                            />
                        </TooltipContainer>
                    </div>

                    <p className='w-[15%] text-center'>{slashedVals.f_slashing_reason.split(/(?=[A-Z])/).join(" ")}</p>

                    <div className='w-[15%] md:hover:underline underline-offset-4 decoration-2 text-[var(--darkPurple)] dark:text-[var(--purple)]'>
                        <LinkSlot slot={slashedVals.f_slot} mxAuto />
                    </div>

                    <div className='w-[15%] md:hover:underline underline-offset-4 decoration-2 text-[var(--darkPurple)] dark:text-[var(--purple)]'>
                        <LinkEpoch epoch={slashedVals.f_epoch} mxAuto />
                    </div>

                </LargeTableRow>
            ))}
        </LargeTable>
    );

    // SlashedVals Small View
    const getSlashedValsSmallView = () => (
        <SmallTable noRowsText='No Slashed Validators' fetchingRows={false}>
            {slashedVals.map(slashedVals => (
                <SmallTableCard key={slashedVals.f_slashed_validator_index}>
                        <div className='flex flex-col'>
                            <div className='flex items-center justify-between py-1 gap-2 flex-wrap'>
                                <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>Slashed Validators: </p>
                                    <LinkValidator validator={slashedVals.f_slashed_validator_index} mxAuto />
                                <div className='flex'>
                                    <span>(</span>
                                    <LinkEntity entity={slashedVals.f_slashed_validator_pool_name} mxAuto />
                                    <p>)</p>
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col'>
                            <div className='flex items-center justify-between py-1 gap-2 flex-wrap'>
                                <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>Slashed By: </p>
                                <LinkValidator validator={slashedVals.f_slashed_by_validator_index} mxAuto />
                                <div className='flex justify-center'>
                                    <span>(</span>
                                    <LinkEntity entity={slashedVals.f_slashed_by_validator_pool_name} mxAuto />
                                    <p>)</p>
                                </div>
                            </div>
                        </div>

                        <div className='flex items-center justify-between py-1 gap-2'>
                                <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>Time:</p>
                                <div className='flex flex-col text-end'>
                                    <TooltipContainer>
                                        <div>
                                            <p>{Age(blockGenesis + slashedVals.f_slot * 12000)}</p>
                                        </div>
                                        <TooltipResponsive
                                        width={120}
                                        content={
                                            <>
                                                <p>{new Date(blockGenesis + slashedVals.f_slot * 12000).toLocaleDateString('ja-JP')}</p>
                                                <p>{new Date(blockGenesis + slashedVals.f_slot * 12000).toLocaleTimeString('ja-JP')}</p>
                                            </>
                                        }
                                        top='34px'
                                        polygonCenter
                                        />
                                    </TooltipContainer>
                                </div>
                            </div>

                        <div className='flex flex-col'>
                            <div className='flex items-center justify-between py-1 gap-2'>
                                <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>Reason: </p>
                                <p>{slashedVals.f_slashing_reason.split(/(?=[A-Z])/).join(" ")}</p>
                            </div>
                        </div>

                        <div className='flex flex-col'>
                            <div className='flex items-center justify-between py-1 gap-2'>
                                <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>Slot: </p>
                                <LinkSlot slot={slashedVals.f_slot} />
                            </div>
                        </div>

                        <div className='flex flex-col'>
                            <div className='flex items-center justify-between py-1 gap-2'>
                                <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>Epoch: </p>
                                <LinkEpoch epoch={slashedVals.f_epoch} mxAuto />
                            </div>
                        </div>
                </SmallTableCard>
            ))}
        </SmallTable>
    );

    return <>{isLargeView ? getContentSlashedValsLargeView() : getSlashedValsSmallView()}</>;
};

export default SlashedVals;

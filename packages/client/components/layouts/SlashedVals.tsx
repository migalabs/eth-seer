import React, { useState, useEffect } from 'react';

// Hooks
import useLargeView from '../../hooks/useLargeView';

// Components
import LinkValidator from '../ui/LinkValidator';
import LinkSlot from '../ui/LinkSlot';
import LinkEntity from '../ui/LinkEntity';
import BlockState from '../ui/BlockState';
import LinkEpoch from '../ui/LinkEpoch';
import { LargeTable, LargeTableHeader, LargeTableRow, SmallTable, SmallTableCard } from '../ui/Table';

// Types
import { SlashedVal } from '../../types';
import { getShortAddress } from '../../helpers/addressHelper';

// Props
type Props = {
    slashedVals: SlashedVal[];
};

const SlashedVals = ({slashedVals}: Props) => {
    // Large View Hook
    const isLargeView = useLargeView();
    // SLashed Validators Large View
    const getContentSlashedValsLargeView = () => (
        <LargeTable
        minWidth={1150}
        noRowsText='No Slashed Validators'
        fetchingRows={false}
        showRowsWhileFetching={false}>
            <LargeTableHeader text='Entity' width='28%' />
            <LargeTableHeader text='Slashed Validators' width='15%' />
            <LargeTableHeader text='Slashed by' width='15%' />
            <LargeTableHeader text='Reason' width='15%' />
            <LargeTableHeader text='Slot' width='15%' />
            <LargeTableHeader text='Epoch' width='15%' />

            {slashedVals.map(slashedVals => (
                <LargeTableRow key={slashedVals.f_slashed_validator_index}>
                    <div className='w-[28%] uppercase md:hover:underline underline-offset-4 decoration-2 text-[var(--darkPurple)] dark:text-[var(--purple)]'>
                        <LinkEntity entity={slashedVals.f_pool_name} mxAuto />
                    </div>

                    <div className='w-[15%] md:hover:underline underline-offset-4 decoration-2 text-[var(--darkPurple)] dark:text-[var(--purple)]'>
                        <LinkValidator validator={slashedVals.f_slashed_validator_index} mxAuto />
                    </div>

                    <div className='w-[15%] md:hover:underline underline-offset-4 decoration-2 text-[var(--darkPurple)] dark:text-[var(--purple)]'>
                        <LinkValidator validator={slashedVals.f_slashed_by_validator_index} mxAuto />
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
                            <div className='flex items-center justify-between py-1 gap-2'>
                                <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>Entity: </p>
                                <LinkEntity entity={slashedVals.f_pool_name} mxAuto />
                            </div>
                        </div>

                        <div className='flex flex-col'>
                            <div className='flex items-center justify-between py-1 gap-2'>
                                <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>Slashed Validators: </p>
                                <LinkValidator validator={slashedVals.f_slashed_validator_index} mxAuto />
                            </div>
                        </div>

                        <div className='flex flex-col'>
                            <div className='flex items-center justify-between py-1 gap-2'>
                                <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>Slashed By: </p>
                                <LinkValidator validator={slashedVals.f_slashed_by_validator_index} mxAuto />
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

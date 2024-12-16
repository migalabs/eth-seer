import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';

// Axios
import axiosClient from '../../config/axios';

// Hooks
import useLargeView from '../../hooks/useLargeView';

// Components
import ProgressTileBar from '../ui/ProgressTileBar';
import ProgressSmoothBar from '../ui/ProgressSmoothBar';
import TooltipContainer from '../ui/TooltipContainer';
import CustomImage from '../ui/CustomImage';
import TooltipResponsive from '../ui/TooltipResponsive';
import LinkEpoch from '../ui/LinkEpoch';
import LinkIcon from '../ui/LinkIcon';
import { LargeTableHeader, LargeTableRow, LargeTable, SmallTable, SmallTableCard } from '../ui/Table';

// Types
import { Epoch, Block } from '../../types';

// Props
type Props = {
    epochs: Epoch[];
    blocksPerEpoch?: Record<number, Block[]>; // Used for calculating epochs
    showCalculatingEpochs?: boolean;
    fetchingEpochs?: boolean;
    showRowsWhileFetching?: boolean;
};

const Epochs = ({ epochs, blocksPerEpoch, showCalculatingEpochs, fetchingEpochs, showRowsWhileFetching }: Props) => {
    // Router
    const router = useRouter();
    const { network } = router.query;

    // Large View Hook
    const isLargeView = useLargeView();

    // States
    const [calculatingText, setCalculatingText] = useState('');
    const [blockGenesis, setBlockGenesis] = useState(0);

    //UseEffect
    useEffect(() => {
        if (network && blockGenesis === 0) {
            getBlockGenesis(network as string);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [network]);

    const shuffle = useCallback(() => {
        setCalculatingText(prevState => {
            if (!prevState || prevState === 'Calculating...') {
                return 'Calculating';
            } else {
                return prevState + '.';
            }
        });
    }, []);

    useEffect(() => {
        const intervalID = setInterval(shuffle, 1000);
        return () => clearInterval(intervalID);
    }, [shuffle]);

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

    const createArrayBlocks = (blocks: Block[]) => blocks?.map(element => (element.f_proposed ? 1 : 0));

    // Calculating epochs desktop
    const getCalculatingEpochDesktop = (f_epoch: number, blocks: Block[]) => {
        const arrayBlocks = createArrayBlocks(blocks);

        if (!arrayBlocks) {
            return null;
        }

        return (
            <LargeTableRow secundary>
                <div className='w-[10%] flex flex-col pt-2.5 pb-2.5'>
                    <p>{new Date(blockGenesis + f_epoch * 32 * 12000).toLocaleDateString('ja-JP')}</p>
                    <p>{new Date(blockGenesis + f_epoch * 32 * 12000).toLocaleTimeString('ja-JP')}</p>
                </div>

                <div className='w-[11%] md:hover:underline underline-offset-4 decoration-2'>
                    <LinkEpoch epoch={f_epoch} mxAuto />
                </div>

                <div className='w-[15%]'>
                    <p className='w-13 uppercase mx-auto text-center'>{calculatingText}</p>
                </div>

                <div className='w-[25%]'>
                    <p className='w-13 uppercase mx-auto text-center'>{calculatingText}</p>
                </div>

                <div className='w-[18%]'>
                    <p className='w-13 uppercase mx-auto text-center'>{calculatingText}</p>
                </div>

                <div className='w-[15%] pt-3.5 mb-5'>
                    <p className='uppercase text-center'>Blocks</p>

                    <ProgressTileBar
                        totalBlocks={arrayBlocks}
                        tooltipContent={
                            <>
                                <span>Proposed Blocks: {arrayBlocks.filter(element => element === 1).length}</span>

                                <span>
                                    Missed Blocks:{' '}
                                    {arrayBlocks.length === 32
                                        ? 32 - arrayBlocks.filter(element => element === 1).length
                                        : arrayBlocks.length - arrayBlocks.filter(element => element === 1).length}
                                </span>
                            </>
                        }
                    />
                </div>

                <div className='w-[32%]'>
                    <p className='w-32 uppercase mx-auto text-start'>{calculatingText}</p>
                </div>

                <div className='w-[32%]'>
                    <p className='w-32 uppercase mx-auto text-start'>{calculatingText}</p>
                </div>
            </LargeTableRow>
        );
    };

    // Calculating epochs mobile
    const getCalculatingEpochMobile = (f_epoch: number, blocks: Block[]) => {
        const arrayBlocks = createArrayBlocks(blocks);

        if (!arrayBlocks) {
            return null;
        }

        return (
            <SmallTableCard secundary>
                <div className='flex gap-x-1 justify-center'>
                    <LinkEpoch epoch={f_epoch}>
                        <p className='font-semibold text-[16px] mt-0.5'>Epoch {f_epoch?.toLocaleString()}</p>
                        <LinkIcon />
                    </LinkEpoch>
                </div>

                <div className='flex flex-col gap-x-4 w-full'>
                    <div className='flex gap-x-1 justify-center mb-1'>
                        <p className='mt-1 font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>Time</p>
                        <TooltipContainer>
                            <CustomImage
                                src='/static/images/icons/information_icon.webp'
                                alt='Time information'
                                width={24}
                                height={24}
                            />

                            <TooltipResponsive
                                width={220}
                                content={
                                    <>
                                        <span>Time at which the slot</span>
                                        <span>should have passed</span>
                                        <span>(calculated since genesis)</span>
                                    </>
                                }
                                top='34px'
                            />
                        </TooltipContainer>
                    </div>

                    <div>
                        <p>{new Date(blockGenesis + f_epoch * 32 * 12000).toLocaleDateString('ja-JP')}</p>
                        <p>{new Date(blockGenesis + f_epoch * 32 * 12000).toLocaleTimeString('ja-JP')}</p>
                    </div>
                </div>

                <div className='flex flex-col w-full'>
                    <div className='flex gap-x-1 items-center justify-center mb-1'>
                        <p className='mt-1 font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>Attestations</p>
                        <TooltipContainer>
                            <CustomImage
                                src='/static/images/icons/information_icon.webp'
                                alt='Attestation Accuracy information'
                                width={24}
                                height={24}
                            />

                            <TooltipResponsive
                                width={200}
                                content={
                                    <>
                                        <span>Number of attestations included in blocks in the epochs</span>
                                    </>
                                }
                                top='34px'
                                polygonRight
                            />
                        </TooltipContainer>
                    </div>

                    <div>
                        <p className='w-32 uppercase mx-auto text-center'>{calculatingText}</p>
                    </div>
                </div>

                <div className='flex flex-col w-full'>
                    <div className='flex gap-x-1 items-center justify-center mb-1'>
                    <p className='mt-1 font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>Deposits/Withdrawals</p>
                        <TooltipContainer>
                            <CustomImage
                                src='/static/images/icons/information_icon.webp'
                                alt='Attestation Accuracy information'
                                width={24}
                                height={24}
                            />

                            <TooltipResponsive
                                width={200}
                                content={
                                    <>
                                        <span>Number of eth2 deposits and withdrawals included in the epoch</span>
                                    </>
                                }
                                top='34px'
                                polygonRight
                            />
                        </TooltipContainer>
                    </div>
                    <div>
                        <p className='w-32 uppercase mx-auto text-center'>{calculatingText}</p>
                    </div>
                </div>

                <div className='flex flex-col w-full'>
                    <div className='flex gap-x-1 items-center justify-center mb-1'>
                    <p className='mt-1 font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>Slashing P / A</p>
                        <TooltipContainer>
                            <CustomImage
                                src='/static/images/icons/information_icon.webp'
                                alt='Attestation Accuracy information'
                                width={24}
                                height={24}
                            />

                            <TooltipResponsive
                                width={200}
                                content={
                                    <>
                                        <span>Number of new proposer and attester slashings included in the epoch</span>
                                    </>
                                }
                                top='34px'
                                polygonRight
                            />
                        </TooltipContainer>
                    </div>
                    <div>
                        <p className='w-32 uppercase mx-auto text-center'>{calculatingText}</p>
                    </div>
                </div>

                <div className='flex flex-col w-full'>
                    <div className='flex gap-x-1 justify-center mb-1'>
                        <p className='mt-1 font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>Blocks</p>
                        <TooltipContainer>
                            <CustomImage
                                src='/static/images/icons/information_icon.webp'
                                alt='Blocks information'
                                width={24}
                                height={24}
                            />

                            <TooltipResponsive
                                width={220}
                                content={
                                    <>
                                        <span>Proposed Blocks out of 32</span>
                                        <span>vs</span>
                                        <span>Missed Blocks</span>
                                    </>
                                }
                                top='34px'
                            />
                        </TooltipContainer>
                    </div>

                    <div>
                        <ProgressTileBar
                            totalBlocks={arrayBlocks}
                            tooltipContent={
                                <>
                                    <span>Proposed Blocks: {arrayBlocks.filter(element => element === 1).length}</span>

                                    <span>
                                        Missed Blocks:{' '}
                                        {arrayBlocks.length === 32
                                            ? 32 - arrayBlocks.filter(element => element === 1).length
                                            : arrayBlocks.length - arrayBlocks.filter(element => element === 1).length}
                                    </span>
                                </>
                            }
                        />
                    </div>
                </div>

                <div className='flex flex-col w-full'>
                    <div className='flex gap-x-1 items-center justify-center mb-1'>
                        <p className='mt-1 font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>
                            Attestation Accuracy
                        </p>
                        <TooltipContainer>
                            <CustomImage
                                src='/static/images/icons/information_icon.webp'
                                alt='Attestation Accuracy information'
                                width={24}
                                height={24}
                            />

                            <TooltipResponsive
                                width={250}
                                content={
                                    <>
                                        <span>Correctly Attested Flag Count</span>
                                        <span>vs</span>
                                        <span>Expected Attesting Flag Count</span>
                                    </>
                                }
                                top='34px'
                                polygonRight
                            />
                        </TooltipContainer>
                    </div>

                    <div>
                        <p className='w-32 uppercase mx-auto text-start'>{calculatingText}</p>
                    </div>
                </div>

                <div className='flex flex-col w-full'>
                    <div className='flex gap-x-1 items-center justify-center mb-1'>
                        <p className='mt-1 font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>
                            Voting Participation
                        </p>

                        <TooltipContainer>
                            <CustomImage
                                src='/static/images/icons/information_icon.webp'
                                alt='Attestation Accuracy information'
                                width={24}
                                height={24}
                            />

                            <TooltipResponsive
                                width={200}
                                content={
                                    <>
                                        <span>Attesting Balance</span>
                                        <span>vs</span>
                                        <span>Total Active Balance</span>
                                    </>
                                }
                                top='34px'
                                polygonRight
                            />
                        </TooltipContainer>
                    </div>

                    <div>
                        <p className='w-32 uppercase mx-auto text-start'>{calculatingText}</p>
                    </div>
                </div>
            </SmallTableCard>
        );
    };

    // Proposed blocks
    const getProposedBlocks = (totalBlock: Array<number>) => totalBlock?.filter(element => element === 1).length;

    // Large View
    const getLargeView = () => (
        <LargeTable
            minWidth={1150}
            noRowsText='No Epochs'
            fetchingRows={fetchingEpochs}
            showRowsWhileFetching={showRowsWhileFetching}
        >
            <LargeTableHeader
                text='Time'
                width='10%'
                tooltipContent={
                    <TooltipResponsive
                        width={220}
                        content={
                            <>
                                <span>Time at which the slot</span>
                                <span>should have passed</span>
                                <span>(calculated since genesis)</span>
                            </>
                        }
                        top='34px'
                        polygonLeft
                    />
                }
            />

            <LargeTableHeader
                text='Epoch'
                width='11%'
                tooltipContent={<TooltipResponsive width={130} content={<span>Epoch number</span>} top='34px' />}
            />

            <LargeTableHeader
                text='Attestations'
                width='15%'
                tooltipContent={<TooltipResponsive width={220} content={<span>Number of attestations included in blocks in the epochs</span>} top='34px' />}
            />

            <LargeTableHeader
                text='Deposits/Withdrawals'
                width='25%'
                tooltipContent={<TooltipResponsive width={200} content={<span>Number of eth2 deposits and withdrawals included in the epoch</span>} top='34px' />}
            />

            <LargeTableHeader
                text='Slashing P / A'
                width='19%'
                tooltipContent={<TooltipResponsive width={200} content={<span>Number of new proposer and attester slashings included in the epoch</span>} top='34px' />}
            />

            <LargeTableHeader
                text='Blocks'
                width='11%'
                tooltipContent={
                    <TooltipResponsive
                        width={220}
                        content={
                            <>
                                <span>Proposed Blocks out of 32</span>
                                <span>vs</span>
                                <span>Missed Blocks</span>
                            </>
                        }
                        top='34px'
                    />
                }
            />

            <LargeTableHeader
                text='Attestation Accuracy'
                width='34%'
                tooltipContent={
                    <TooltipResponsive
                        width={240}
                        content={
                            <>
                                <span>Correctly Attested Flag Count</span>
                                <span>vs</span>
                                <span>Expected Attesting Flag Count</span>
                            </>
                        }
                        top='34px'
                    />
                }
            />

            <LargeTableHeader
                text='Voting Participation'
                width='22%'
                tooltipContent={
                    <TooltipResponsive
                        width={180}
                        content={
                            <>
                                <span>Attesting Balance</span>
                                <span>vs</span>
                                <span>Total Active Balance</span>
                            </>
                        }
                        top='34px'
                        polygonRight
                    />
                }
            />

            {showCalculatingEpochs && epochs.length > 0 && blocksPerEpoch && (
                <>
                    {getCalculatingEpochDesktop(epochs[0].f_epoch + 2, blocksPerEpoch[epochs[0].f_epoch + 2])}
                    {getCalculatingEpochDesktop(epochs[0].f_epoch + 1, blocksPerEpoch[epochs[0].f_epoch + 1])}
                </>
            )}

            {epochs.map((epoch: Epoch, idx: number) => (
                <LargeTableRow key={epoch.f_epoch}>
                    <div className='w-[10%] flex flex-col text-center'>
                        <p>{new Date(blockGenesis + epoch.f_epoch * 32 * 12000).toLocaleDateString('ja-JP')}</p>
                        <p>{new Date(blockGenesis + epoch.f_epoch * 32 * 12000).toLocaleTimeString('ja-JP')}</p>
                    </div>

                    <div className='w-[11%] font-medium md:hover:underline underline-offset-4 decoration-2 text-[var(--darkPurple)] dark:text-[var(--purple)]'>
                        <LinkEpoch epoch={epoch.f_epoch} mxAuto />
                    </div>

                    <div className='w-[15%] flex flex-col text-center'>
                        <p>{epoch?.f_num_att}</p>
                    </div>

                    <div className='w-[25%] flex flex-col text-center'>
                        <p>{epoch?.f_deposits_num}/{epoch?.f_withdrawals_num}</p>
                    </div>

                    <div className='w-[18%] flex flex-col text-center'>
                        <p>{epoch?.f_new_proposer_slashings}/{epoch?.f_new_attester_slashings}</p>
                    </div>

                    <div className='w-[14%] pt-3.5 mb-5 m-1'>
                        <p className='uppercase text-center mb-2'>Blocks</p>

                        <ProgressTileBar
                            totalBlocks={epoch.proposed_blocks}
                            tooltipContent={
                                <>
                                    <span>Proposed Blocks: {getProposedBlocks(epoch.proposed_blocks)}</span>
                                    <span>Missed Blocks: {32 - getProposedBlocks(epoch.proposed_blocks)}</span>
                                </>
                            }
                            tooltipAbove={idx === epochs.length - 1}
                        />
                    </div>

                    <div className='w-[32%] m-2'>
                        <div className='flex gap-x-1 justify-center'>
                            <div className='flex-1'>
                                <ProgressSmoothBar
                                    title='Source'
                                    color='#343434'
                                    backgroundColor='#f5f5f5'
                                    percent={1 - epoch.f_missing_source / epoch.f_num_active_vals}
                                    tooltipColor='blue'
                                    tooltipContent={
                                        <>
                                            <span>Missing Source: {epoch.f_missing_source?.toLocaleString()}</span>
                                            <span>Attestating Validators: {epoch.f_num_active_vals?.toLocaleString()}</span>
                                        </>
                                    }
                                    widthTooltip={220}
                                    tooltipAbove={idx === epochs.length - 1}
                                />
                            </div>

                            <div className='flex-1'>
                                <ProgressSmoothBar
                                    title='Target'
                                    color='#343434'
                                    backgroundColor='#f5f5f5'
                                    percent={1 - epoch.f_missing_target / epoch.f_num_active_vals}
                                    tooltipColor='orange'
                                    tooltipContent={
                                        <>
                                            <span>Missing Target: {epoch.f_missing_target?.toLocaleString()}</span>
                                            <span>Attestasting Validators: {epoch.f_num_active_vals?.toLocaleString()}</span>
                                        </>
                                    }
                                    widthTooltip={220}
                                    tooltipAbove={idx === epochs.length - 1}
                                />
                            </div>

                            <div className='flex-1'>
                                <ProgressSmoothBar
                                    title='Head'
                                    color='#343434'
                                    backgroundColor='#f5f5f5'
                                    percent={1 - epoch.f_missing_head / epoch.f_num_active_vals}
                                    tooltipColor='purple'
                                    tooltipContent={
                                        <>
                                            <span>Missing Head: {epoch.f_missing_head?.toLocaleString()}</span>
                                            <span>Attesting Validators: {epoch.f_num_active_vals?.toLocaleString()}</span>
                                        </>
                                    }
                                    widthTooltip={220}
                                    tooltipAbove={idx === epochs.length - 1}
                                />
                            </div>
                        </div>
                    </div>

                    <div className='w-[20%] m-2'>
                        <ProgressSmoothBar
                            title='Attesting/Total active'
                            color='#343434'
                            backgroundColor='#f5f5f5'
                            percent={epoch.f_att_effective_balance_eth / epoch.f_total_effective_balance_eth}
                            tooltipColor='bluedark'
                            tooltipContent={
                                <>
                                    <span>Att. Balance: {epoch.f_att_effective_balance_eth?.toLocaleString()} ETH</span>
                                    <span>
                                        Act. Balance: {epoch.f_total_effective_balance_eth?.toLocaleString()} ETH
                                    </span>
                                </>
                            }
                            widthTooltip={270}
                            tooltipAbove={idx === epochs.length - 1}
                        />
                    </div>
                </LargeTableRow>
            ))}
        </LargeTable>
    );

    // Small View
    const getSmallView = () => (
        <SmallTable noRowsText='No Epochs' fetchingRows={fetchingEpochs} showRowsWhileFetching={showRowsWhileFetching}>
            {showCalculatingEpochs && epochs.length > 0 && blocksPerEpoch && (
                <>
                    {getCalculatingEpochMobile(epochs[0].f_epoch + 2, blocksPerEpoch[epochs[0].f_epoch + 2])}
                    {getCalculatingEpochMobile(epochs[0].f_epoch + 1, blocksPerEpoch[epochs[0].f_epoch + 1])}
                </>
            )}

            {epochs.map((epoch: Epoch) => (
                <SmallTableCard key={epoch.f_epoch}>
                    <div className='flex gap-x-1 justify-center'>
                        <LinkEpoch epoch={epoch.f_epoch}>
                            <p className='font-semibold text-[16px] mt-0.5'>Epoch {epoch.f_epoch?.toLocaleString()}</p>
                            <LinkIcon />
                        </LinkEpoch>
                    </div>

                    <div className='flex flex-col gap-x-4 w-full'>
                        <div className='flex gap-x-1 justify-center mb-1'>
                            <p className='mt-1 font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>Time</p>
                            <TooltipContainer>
                                <CustomImage
                                    src='/static/images/icons/information_icon.webp'
                                    alt='Time information'
                                    width={24}
                                    height={24}
                                />

                                <TooltipResponsive
                                    width={220}
                                    content={
                                        <>
                                            <span>Time at which the slot</span>
                                            <span>should have passed</span>
                                            <span>(calculated since genesis)</span>
                                        </>
                                    }
                                    top='34px'
                                />
                            </TooltipContainer>
                        </div>
                        <div className='text-center'>
                            <p>{new Date(blockGenesis + epoch.f_epoch * 32 * 12000).toLocaleDateString('ja-JP')}</p>
                            <p>{new Date(blockGenesis + epoch.f_epoch * 32 * 12000).toLocaleTimeString('ja-JP')}</p>
                        </div>
                    </div>

                    <div className='flex flex-col gap-x-4 w-full'>
                        <div className='flex gap-x-1 justify-center mb-1'>
                            <p className='mt-1 font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>Attestations</p>
                            <TooltipContainer>
                                <CustomImage
                                    src='/static/images/icons/information_icon.webp'
                                    alt='Time information'
                                    width={24}
                                    height={24}
                                />

                                <TooltipResponsive
                                    width={220}
                                    content={
                                        <>
                                            <span>Number of attestations included in blocks in the epochs</span>
                                        </>
                                    }
                                    top='34px'
                                />
                            </TooltipContainer>
                        </div>
                        <div className='text-center'>
                            <p>{epoch?.f_num_att}</p>
                        </div>
                    </div>

                    <div className='flex flex-col gap-x-4 w-full'>
                        <div className='flex gap-x-1 justify-center mb-1'>
                            <p className='mt-1 font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>Deposits/Withdrawals</p>
                            <TooltipContainer>
                                <CustomImage
                                    src='/static/images/icons/information_icon.webp'
                                    alt='Time information'
                                    width={24}
                                    height={24}
                                />

                                <TooltipResponsive
                                    width={220}
                                    content={
                                        <>
                                            <span>Number of eth2 deposits and withdrawals included in the epoch</span>
                                        </>
                                    }
                                    top='34px'
                                />
                            </TooltipContainer>
                        </div>
                        <div className='text-center'>
                            <p>{epoch?.f_deposits_num}/{epoch?.f_withdrawals_num}</p>
                        </div>
                    </div>

                    <div className='flex flex-col gap-x-4 w-full'>
                        <div className='flex gap-x-1 justify-center mb-1'>
                            <p className='mt-1 font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>Slashing P / A</p>
                            <TooltipContainer>
                                <CustomImage
                                    src='/static/images/icons/information_icon.webp'
                                    alt='Time information'
                                    width={24}
                                    height={24}
                                />

                                <TooltipResponsive
                                    width={220}
                                    content={
                                        <>
                                            <span>Number of new proposer and attester slashings included in the epoch</span>
                                        </>
                                    }
                                    top='34px'
                                />
                            </TooltipContainer>
                        </div>
                        <div className='text-center'>
                            <p>{epoch?.f_new_proposer_slashings}/{epoch?.f_new_attester_slashings}</p>
                        </div>
                    </div>


                    <div className='flex flex-col w-full'>
                        <div className='flex gap-x-1 justify-center mb-1'>
                            <p className='mt-1 font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>Blocks</p>
                            <TooltipContainer>
                                <CustomImage
                                    src='/static/images/icons/information_icon.webp'
                                    alt='Blocks information'
                                    width={24}
                                    height={24}
                                />

                                <TooltipResponsive
                                    width={220}
                                    content={
                                        <>
                                            <span>Proposed Blocks out of 32</span>
                                            <span>vs</span>
                                            <span>Missed Blocks</span>
                                        </>
                                    }
                                    top='34px'
                                />
                            </TooltipContainer>
                        </div>
                        <div>
                            <ProgressTileBar
                                totalBlocks={epoch.proposed_blocks}
                                tooltipContent={
                                    <>
                                        <span>Proposed Blocks: {getProposedBlocks(epoch.proposed_blocks)}</span>
                                        <span>Missed Blocks: {32 - getProposedBlocks(epoch.proposed_blocks)}</span>
                                    </>
                                }
                            />
                        </div>
                    </div>

                    <div className='flex flex-col w-full gap-y-2'>
                        <div className='flex gap-x-1 items-center justify-center mb-1'>
                            <p className='mt-1 font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>
                                Attestation Accuracy
                            </p>
                            <TooltipContainer>
                                <CustomImage
                                    src='/static/images/icons/information_icon.webp'
                                    alt='Attestation Accuracy information'
                                    width={24}
                                    height={24}
                                />

                                <TooltipResponsive
                                    width={240}
                                    content={
                                        <>
                                            <span>Correctly Attested Flag Count</span>
                                            <span>vs</span>
                                            <span>Expected Attesting Flag Count</span>
                                        </>
                                    }
                                    top='34px'
                                    polygonRight
                                />
                            </TooltipContainer>
                        </div>

                        <ProgressSmoothBar
                            title='Source'
                            color='#343434'
                            backgroundColor='#f5f5f5'
                            percent={1 - epoch.f_missing_source / epoch.f_num_active_vals}
                            tooltipColor='blue'
                            tooltipContent={
                                <>
                                    <span>Missing Source: {epoch.f_missing_source?.toLocaleString()}</span>
                                    <span>Attesting Validators: {epoch.f_num_active_vals?.toLocaleString()}</span>
                                </>
                            }
                            widthTooltip={220}
                        />

                        <ProgressSmoothBar
                            title='Target'
                            color='#343434'
                            backgroundColor='#f5f5f5'
                            percent={1 - epoch.f_missing_target / epoch.f_num_active_vals}
                            tooltipColor='orange'
                            tooltipContent={
                                <>
                                    <span>Missing Target: {epoch.f_missing_target?.toLocaleString()}</span>
                                    <span>Attesting Validators: {epoch.f_num_active_vals?.toLocaleString()}</span>
                                </>
                            }
                            widthTooltip={220}
                        />

                        <ProgressSmoothBar
                            title='Head'
                            color='#343434'
                            backgroundColor='#f5f5f5'
                            percent={1 - epoch.f_missing_head / epoch.f_num_active_vals}
                            tooltipColor='purple'
                            tooltipContent={
                                <>
                                    <span>Missing Head: {epoch.f_missing_head?.toLocaleString()}</span>
                                    <span>Attesting Validators: {epoch.f_num_active_vals?.toLocaleString()}</span>
                                </>
                            }
                            widthTooltip={220}
                        />
                    </div>

                    <div className='flex flex-col w-full gap-y-2'>
                        <div className='flex gap-x-1 items-center justify-center mb-1'>
                            <p className='mt-1 font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>
                                Voting Participation
                            </p>
                            <TooltipContainer>
                                <CustomImage
                                    src='/static/images/icons/information_icon.webp'
                                    alt='Balance information'
                                    width={24}
                                    height={24}
                                />

                                <TooltipResponsive
                                    width={180}
                                    content={
                                        <>
                                            <span>Attesting Balance</span>
                                            <span>vs</span>
                                            <span>Total Active Balance</span>
                                        </>
                                    }
                                    top='34px'
                                    polygonRight
                                />
                            </TooltipContainer>
                        </div>

                        <ProgressSmoothBar
                            title='Attesting/Total active'
                            color='#343434'
                            backgroundColor='#f5f5f5'
                            percent={epoch.f_num_att_vals / epoch.f_num_active_vals}
                            tooltipColor='bluedark'
                            tooltipContent={
                                <>
                                    <span>Att. Balance: {epoch.f_att_effective_balance_eth?.toLocaleString()} ETH</span>
                                    <span>
                                        Act. Balance: {epoch.f_total_effective_balance_eth?.toLocaleString()} ETH
                                    </span>
                                </>
                            }
                            widthTooltip={270}
                        />
                    </div>
                </SmallTableCard>
            ))}
        </SmallTable>
    );

    return <>{isLargeView ? getLargeView() : getSmallView()}</>;
};

export default Epochs;

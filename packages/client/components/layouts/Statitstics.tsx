import React, { useEffect, useRef, useState, useCallback, useContext } from 'react';
import { useInView } from 'react-intersection-observer';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';
import BlocksContext from '../../contexts/blocks/BlocksContext';
import EpochsContext from '../../contexts/epochs/EpochsContext';

// Components
import ProgressTileBar from '../ui/ProgressTileBar';
import ProgressSmoothBar from '../ui/ProgressSmoothBar';
import Loader from '../ui/Loader';
import { TooltipContainer, TooltipContentContainerHeaders } from '../ui/Tooltips';
import CustomImage from '../ui/CustomImage';

// Types
import { Epoch, Block } from '../../types';
import Link from 'next/link';

// Constants
const firstBlock: number = Number(process.env.NEXT_PUBLIC_NETWORK_GENESIS);

const Statitstics = () => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) || {};

    // Blocks Context
    const { blocks, getBlocks } = useContext(BlocksContext) || {};

    // Epochs Context
    const { epochs, getEpochs } = useContext(EpochsContext) || {};

    // Intersection Observer
    const { ref, inView } = useInView();

    // Refs
    const containerRef = useRef<HTMLInputElement>(null);

    // States
    const [desktopView, setDesktopView] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [loadingBlocks, setLoadingBlocks] = useState(false);
    const [loadingEpochs, setLoadingEpochs] = useState(false);
    const [calculatingText, setCalculatingText] = useState('');
    const [viewMore, setViewMore] = useState(false);

    useEffect(() => {
        // Fetching blocks
        if (blocks && !blocks.epochs && !loadingBlocks) {
            setLoadingBlocks(true);
            getBlocks?.(0);
        }

        // Fetching epochs
        if (epochs && epochs.epochs.length === 0 && !loadingEpochs) {
            // setLoadingEpochs(true);
            getEpochs?.(0);
        }

        setDesktopView(window !== undefined && window.innerWidth > 768);

        if (viewMore && epochs && !epochs.lastPageFetched) {
            getEpochs?.(currentPage + 1);
            setCurrentPage(prevState => prevState + 1);
            setViewMore(false);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewMore, blocks, epochs]);

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

    const handleMouseMove = (e: any) => {
        if (containerRef.current) {
            const x = e.pageX;
            const limit = 0.15;

            if (x < containerRef.current.clientWidth * limit) {
                containerRef.current.scrollLeft -= 10;
            } else if (x > containerRef.current.clientWidth * (1 - limit)) {
                containerRef.current.scrollLeft += 10;
            }
        }
    };

    const handleClick = () => {
        setViewMore(true);
    };

    const createArrayBlocks = (blocks: Block[]) => {
        const arrayBlocks = blocks?.map(element => (element.f_proposed ? 1 : 0));
        return arrayBlocks;
    };

    const getCalculatingEpochDesktop = (f_epoch: number, blocks: Block[]) => {
        const arrayBlocks = createArrayBlocks(blocks);

        if (!arrayBlocks) {
            return null;
        }

        return (
            <div
                className='flex gap-x-1 justify-around items-center text-[9px] text-black rounded-[22px] px-2 xl:px-8 py-3'
                style={{
                    backgroundColor: themeMode?.darkMode ? 'var(--brown1)' : 'var(--blue3)',
                    boxShadow: themeMode?.darkMode ? 'var(--boxShadowOrange1)' : 'var(--boxShadowBlue2)',
                }}
            >
                <div className='flex flex-col w-[10%] pt-2.5 pb-2.5'>
                    <p>{new Date(firstBlock + f_epoch * 32 * 12000).toLocaleDateString('ja-JP')}</p>
                    <p>{new Date(firstBlock + f_epoch * 32 * 12000).toLocaleTimeString('ja-JP')}</p>
                </div>
                <div className='w-[11%]'>
                    <Link
                        href={{
                            pathname: '/epoch/[id]',
                            query: {
                                id: f_epoch,
                            },
                        }}
                        passHref
                        as={`/epoch/${f_epoch}`}
                        className='flex gap-x-1 items-center w-fit mx-auto'
                    >
                        <p>{f_epoch.toLocaleString()}</p>
                        <CustomImage
                            src='/static/images/link.svg'
                            alt='Link icon'
                            width={20}
                            height={20}
                            className='mb-1'
                        />
                    </Link>
                </div>
                <div className='w-[15%] pt-3.5 mb-6'>
                    <p className='uppercase'>blocks</p>
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
            </div>
        );
    };

    const getCalculatingEpochMobile = (f_epoch: number, blocks: Block[]) => {
        const arrayBlocks = createArrayBlocks(blocks);

        if (!arrayBlocks) {
            return null;
        }

        return (
            <div
                className='flex flex-col gap-y-4 justify-around items-center text-[10px] text-black rounded-[22px] px-3 py-4'
                style={{
                    backgroundColor: themeMode?.darkMode ? 'var(--brown1)' : 'var(--blue3)',
                    boxShadow: themeMode?.darkMode ? 'var(--boxShadowOrange1)' : 'var(--boxShadowBlue2)',
                }}
            >
                <div className='flex gap-x-1 justify-center'>
                    <Link
                        href={{
                            pathname: '/epoch/[id]',
                            query: {
                                id: f_epoch,
                            },
                        }}
                        passHref
                        as={`/epoch/${f_epoch}`}
                    >
                        <p className='font-bold text-sm mt-0.5'>Epoch {f_epoch.toLocaleString()}</p>
                    </Link>
                </div>
                <div className='flex flex-col gap-x-4 w-full'>
                    <div className='flex gap-x-1 justify-center mb-1'>
                        <p className='text-xs mt-1'>Time</p>
                        <TooltipContainer>
                            <CustomImage
                                src='/static/images/information.svg'
                                alt='Time information'
                                width={24}
                                height={24}
                            />
                            <TooltipContentContainerHeaders>
                                <span>Time at which the epoch</span>
                                <span>should have started</span>
                                <span>(calculated since genesis)</span>
                            </TooltipContentContainerHeaders>
                        </TooltipContainer>
                    </div>
                    <div>
                        <p>{new Date(firstBlock + f_epoch * 32 * 12000).toLocaleDateString('ja-JP')}</p>
                        <p>{new Date(firstBlock + f_epoch * 32 * 12000).toLocaleTimeString('ja-JP')}</p>
                    </div>
                </div>
                <div className='flex flex-col w-full'>
                    <div className='flex gap-x-1 justify-center mb-1'>
                        <p className='text-xs mt-1'>Blocks</p>
                        <TooltipContainer>
                            <CustomImage
                                src='/static/images/information.svg'
                                alt='Blocks information'
                                width={24}
                                height={24}
                            />
                            <TooltipContentContainerHeaders>
                                <span>Proposed Blocks out of 32</span>
                                <span>vs</span>
                                <span>Missed Blocks</span>
                            </TooltipContentContainerHeaders>
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
                    <div className='flex flex-col gap-x-1 items-center mb-1'>
                        <p className='text-xs mt-1'>Attestation Accuracy</p>
                        <TooltipContainer>
                            <CustomImage
                                src='/static/images/information.svg'
                                alt='Attestation Accuracy information'
                                width={24}
                                height={24}
                            />
                            <TooltipContentContainerHeaders>
                                <span>Correctly Attested Flag Count</span>
                                <span>vs</span>
                                <span>Expected Attesting Flag Count</span>
                            </TooltipContentContainerHeaders>
                        </TooltipContainer>
                    </div>
                    <div>
                        <p className='w-32 uppercase mx-auto text-start'>{calculatingText}</p>
                    </div>
                </div>
                <div className='flex flex-col w-full'>
                    <div className='flex flex-col gap-x-1 items-center mb-1'>
                        <p className='text-xs mt-1'>Voting Participation</p>
                        <TooltipContainer>
                            <CustomImage
                                src='/static/images/information.svg'
                                alt='Attestation Accuracy information'
                                width={24}
                                height={24}
                            />

                            <TooltipContentContainerHeaders>
                                <span>Attesting Balance</span>
                                <span>vs</span>
                                <span>Total Active Balance</span>
                            </TooltipContentContainerHeaders>
                        </TooltipContainer>
                    </div>
                    <div>
                        <p className='w-32 uppercase mx-auto text-start'>{calculatingText}</p>
                    </div>
                </div>
            </div>
        );
    };

    const getProposedBlocks = (totalBlock: Array<number>) => {
        return totalBlock?.filter(element => element === 1).length;
    };

    const getDesktopView = () => (
        <div
            ref={containerRef}
            className='flex flex-col px-2 xl:px-20 overflow-x-scroll overflow-y-hidden scrollbar-thin pb-4'
            onMouseMove={handleMouseMove}
        >
            <div className='flex gap-x-1 justify-around px-2 xl:px-8 py-3 uppercase text-sm min-w-[1150px]'>
                <div className='flex w-[10%] items-center gap-x-1 justify-center'>
                    <p className='mt-0.5'>Time</p>
                    <TooltipContainer>
                        <CustomImage
                            src='/static/images/information.svg'
                            alt='Time information'
                            width={24}
                            height={24}
                        />
                        <TooltipContentContainerHeaders leftSide>
                            <span>Time at which the epoch</span>
                            <span>should have started</span>
                            <span>(calculated since genesis)</span>
                        </TooltipContentContainerHeaders>
                    </TooltipContainer>
                </div>

                <div className='flex w-[11%] items-center gap-x-1 justify-center'>
                    <p className='mt-0.5'>Epoch</p>
                    <TooltipContainer>
                        <CustomImage
                            src='/static/images/information.svg'
                            alt='Time information'
                            width={24}
                            height={24}
                        />
                        <TooltipContentContainerHeaders epoch>
                            <span>Epoch number</span>
                        </TooltipContentContainerHeaders>
                    </TooltipContainer>
                </div>

                <div className='flex w-[15%] items-center gap-x-1 justify-center'>
                    <p className='mt-0.5'>Blocks</p>
                    <TooltipContainer>
                        <CustomImage
                            src='/static/images/information.svg'
                            alt='Blocks information'
                            width={24}
                            height={24}
                        />
                        <TooltipContentContainerHeaders>
                            <span>Proposed Blocks out of 32</span>
                            <span>vs</span>
                            <span>Missed Blocks</span>
                        </TooltipContentContainerHeaders>
                    </TooltipContainer>
                </div>

                <div className='flex w-[32%] items-center gap-x-1 justify-center'>
                    <p className='mt-0.5'>Attestation Accuracy</p>
                    <TooltipContainer>
                        <CustomImage
                            src='/static/images/information.svg'
                            alt='Attestation Accuracy information'
                            width={24}
                            height={24}
                        />
                        <TooltipContentContainerHeaders>
                            <span>Correctly Attested Flag Count</span>
                            <span>vs</span>
                            <span>Expected Attesting Flag Count</span>
                        </TooltipContentContainerHeaders>
                    </TooltipContainer>
                </div>

                <div className='flex w-[32%] items-center gap-x-1 justify-center'>
                    <p className='mt-0.5'>Voting Participation</p>
                    <TooltipContainer>
                        <CustomImage
                            src='/static/images/information.svg'
                            alt='Balance information'
                            width={24}
                            height={24}
                        />
                        <TooltipContentContainerHeaders rightSide>
                            <span>Attesting Balance</span>
                            <span>vs</span>
                            <span>Total Active Balance</span>
                        </TooltipContentContainerHeaders>
                    </TooltipContainer>
                </div>
            </div>

            <div className='flex flex-col justify-center gap-y-4 min-w-[1150px]'>
                {epochs && epochs.epochs.length > 0 && blocks && blocks.epochs && (
                    <>
                        {getCalculatingEpochDesktop(
                            epochs.epochs[0].f_epoch + 2,
                            blocks.epochs[epochs.epochs[0].f_epoch + 2]
                        )}
                        {getCalculatingEpochDesktop(
                            epochs.epochs[0].f_epoch + 1,
                            blocks.epochs[epochs.epochs[0].f_epoch + 1]
                        )}
                    </>
                )}
                {epochs &&
                    epochs.epochs.map((epoch: Epoch, idx: number) => (
                        <div
                            key={epoch.f_epoch}
                            ref={idx === epochs.epochs.length - 1 ? ref : undefined}
                            className='flex gap-x-1 justify-around items-center text-[9px] text-black rounded-[22px] px-2 xl:px-8 py-3'
                            style={{
                                backgroundColor: themeMode?.darkMode ? 'var(--yellow2)' : 'var(--blue1)',
                                boxShadow: themeMode?.darkMode ? 'var(--boxShadowYellow1)' : 'var(--boxShadowBlue1)',
                            }}
                        >
                            <div className='flex flex-col w-[10%]'>
                                <p>{new Date(firstBlock + epoch.f_epoch * 32 * 12000).toLocaleDateString('ja-JP')}</p>
                                <p>{new Date(firstBlock + epoch.f_epoch * 32 * 12000).toLocaleTimeString('ja-JP')}</p>
                            </div>
                            <div className='w-[11%]'>
                                <Link
                                    href={{
                                        pathname: '/epoch/[id]',
                                        query: {
                                            id: epoch.f_epoch,
                                        },
                                    }}
                                    passHref
                                    as={`/epoch/${epoch.f_epoch}`}
                                    className='flex gap-x-1 items-center w-fit mx-auto'
                                >
                                    <p>{epoch.f_epoch.toLocaleString()}</p>
                                    <CustomImage
                                        src='/static/images/link.svg'
                                        alt='Link icon'
                                        width={20}
                                        height={20}
                                        className='mb-1'
                                    />
                                </Link>
                            </div>

                            <div className='w-[15%] pt-3.5 mb-6'>
                                <p className='uppercase'>blocks</p>
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

                            <div className='mb-2 w-[32%]'>
                                <div className='flex gap-x-1 justify-center '>
                                    <div className='flex-1'>
                                        <ProgressSmoothBar
                                            title='Target'
                                            bg='#E86506'
                                            color='#FFC163'
                                            percent={1 - epoch.f_missing_target / epoch.f_num_vals}
                                            tooltipColor='orange'
                                            tooltipContent={
                                                <>
                                                    <span>
                                                        Missing Target: {epoch.f_missing_target?.toLocaleString()}
                                                    </span>
                                                    <span>Attestations: {epoch.f_num_vals?.toLocaleString()}</span>
                                                </>
                                            }
                                        />
                                    </div>
                                    <div className='flex-1'>
                                        <ProgressSmoothBar
                                            title='Source'
                                            bg='#14946e'
                                            color='#BDFFEB'
                                            percent={1 - epoch.f_missing_source / epoch.f_num_vals}
                                            tooltipColor='blue'
                                            tooltipContent={
                                                <>
                                                    <span>
                                                        Missing Source: {epoch.f_missing_source?.toLocaleString()}
                                                    </span>
                                                    <span>Attestations: {epoch.f_num_vals?.toLocaleString()}</span>
                                                </>
                                            }
                                        />
                                    </div>
                                    <div className='flex-1'>
                                        <ProgressSmoothBar
                                            title='Head'
                                            bg='#532BC5'
                                            color='#E6DDFF'
                                            percent={1 - epoch.f_missing_head / epoch.f_num_vals}
                                            tooltipColor='purple'
                                            tooltipContent={
                                                <>
                                                    <span>Missing Head: {epoch.f_missing_head?.toLocaleString()}</span>
                                                    <span>Attestations: {epoch.f_num_vals?.toLocaleString()}</span>
                                                </>
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className='mb-2 w-[32%]'>
                                <ProgressSmoothBar
                                    title='Attesting/total active'
                                    bg='#0016D8'
                                    color='#BDC4FF'
                                    percent={epoch.f_att_effective_balance_eth / epoch.f_total_effective_balance_eth}
                                    tooltipColor='bluedark'
                                    tooltipContent={
                                        <>
                                            <span>
                                                Att. Balance: {epoch.f_att_effective_balance_eth?.toLocaleString()} ETH
                                            </span>
                                            <span>
                                                Act. Balance: {epoch.f_total_effective_balance_eth?.toLocaleString()}{' '}
                                                ETH
                                            </span>
                                        </>
                                    }
                                />
                            </div>
                        </div>
                    ))}

                <button
                    className='cursor-pointer mx-auto w-fit text-[10px] text-black rounded-[22px] px-3 py-4'
                    onClick={handleClick}
                    style={{
                        backgroundColor: themeMode?.darkMode ? 'var(--yellow2)' : 'var(--blue1)',
                        boxShadow: themeMode?.darkMode ? 'var(--boxShadowYellow1)' : 'var(--boxShadowBlue1)',
                    }}
                >
                    VIEW MORE
                </button>
            </div>
        </div>
    );

    const getPhoneView = () => (
        <div className='flex flex-col gap-y-4 uppercase px-4 mt-3'>
            {epochs && epochs.epochs.length > 0 && blocks && blocks.epochs && (
                <>
                    {getCalculatingEpochMobile(
                        epochs.epochs[0].f_epoch + 2,
                        blocks.epochs[epochs.epochs[0].f_epoch + 2]
                    )}
                    {getCalculatingEpochMobile(
                        epochs.epochs[0].f_epoch + 1,
                        blocks.epochs[epochs.epochs[0].f_epoch + 1]
                    )}
                </>
            )}

            {epochs &&
                epochs.epochs.map((epoch: Epoch, idx: number) => (
                    <div
                        key={epoch.f_epoch}
                        ref={idx === epochs.epochs.length - 1 ? ref : undefined}
                        className='flex flex-col gap-y-4 justify-around items-center text-[10px] text-black rounded-[22px] px-3 py-4'
                        style={{
                            backgroundColor: themeMode?.darkMode ? 'var(--yellow2)' : 'var(--blue1)',
                            boxShadow: themeMode?.darkMode ? 'var(--boxShadowYellow1)' : 'var(--boxShadowBlue1)',
                        }}
                    >
                        <div className='flex gap-x-1 justify-center'>
                            <Link
                                href={{
                                    pathname: '/epoch/[id]',
                                    query: {
                                        id: epoch.f_epoch,
                                    },
                                }}
                                passHref
                                as={`/epoch/${epoch.f_epoch}`}
                            >
                                <p className='font-bold text-sm mt-0.5'>Epoch {epoch.f_epoch?.toLocaleString()}</p>
                            </Link>
                        </div>
                        <div className='flex flex-col gap-x-4 w-full'>
                            <div className='flex gap-x-1 justify-center mb-1'>
                                <p className='text-xs mt-1'>Time</p>
                                <TooltipContainer>
                                    <CustomImage
                                        src='/static/images/information.svg'
                                        alt='Time information'
                                        width={24}
                                        height={24}
                                    />
                                    <TooltipContentContainerHeaders>
                                        <span>Time at which the epoch</span>
                                        <span>should have started</span>
                                        <span>(calculated since genesis)</span>
                                    </TooltipContentContainerHeaders>
                                </TooltipContainer>
                            </div>
                            <div>
                                <p>{new Date(firstBlock + epoch.f_slot * 12000).toLocaleDateString('ja-JP')}</p>
                                <p>{new Date(firstBlock + epoch.f_slot * 12000).toLocaleTimeString('ja-JP')}</p>
                            </div>
                        </div>

                        <div className='flex flex-col w-full'>
                            <div className='flex gap-x-1 justify-center mb-1'>
                                <p className='text-xs mt-1'>Blocks</p>
                                <TooltipContainer>
                                    <CustomImage
                                        src='/static/images/information.svg'
                                        alt='Blocks information'
                                        width={24}
                                        height={24}
                                    />
                                    <TooltipContentContainerHeaders>
                                        <span>Proposed Blocks out of 32</span>
                                        <span>vs</span>
                                        <span>Missed Blocks</span>
                                    </TooltipContentContainerHeaders>
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
                            <div className='flex flex-col gap-x-1 items-center mb-1'>
                                <p className='text-xs mt-1'>Attestation Accuracy</p>
                                <TooltipContainer>
                                    <CustomImage
                                        src='/static/images/information.svg'
                                        alt='Attestation Accuracy information'
                                        width={24}
                                        height={24}
                                    />
                                    <TooltipContentContainerHeaders>
                                        <span>Correctly Attested Flag Count</span>
                                        <span>vs</span>
                                        <span>Expected Attesting Flag Count</span>
                                    </TooltipContentContainerHeaders>
                                </TooltipContainer>
                            </div>
                            <ProgressSmoothBar
                                title='Target'
                                bg='#E86506'
                                color='#FFC163'
                                percent={1 - epoch.f_missing_target / epoch.f_num_vals}
                                tooltipColor='orange'
                                tooltipContent={
                                    <>
                                        <span>Missing Target: {epoch.f_missing_target?.toLocaleString()}</span>
                                        <span>Attestations: {epoch.f_num_vals?.toLocaleString()}</span>
                                    </>
                                }
                            />

                            <ProgressSmoothBar
                                title='Source'
                                bg='#14946e'
                                color='#BDFFEB'
                                percent={1 - epoch.f_missing_source / epoch.f_num_vals}
                                tooltipColor='blue'
                                tooltipContent={
                                    <>
                                        <span>Missing Source: {epoch.f_missing_source?.toLocaleString()}</span>
                                        <span>Attestations: {epoch.f_num_vals?.toLocaleString()}</span>
                                    </>
                                }
                            />

                            <ProgressSmoothBar
                                title='Head'
                                bg='#532BC5'
                                color='#E6DDFF'
                                percent={1 - epoch.f_missing_head / epoch.f_num_vals}
                                tooltipColor='purple'
                                tooltipContent={
                                    <>
                                        <span>Missing Head: {epoch.f_missing_head?.toLocaleString()}</span>
                                        <span>Attestations: {epoch.f_num_vals?.toLocaleString()}</span>
                                    </>
                                }
                            />
                        </div>

                        <div className='flex flex-col w-full gap-y-2'>
                            <div className='flex flex-col gap-x-1 items-center mb-1'>
                                <p className='text-xs mt-1'>Voting Participation</p>
                                <TooltipContainer>
                                    <CustomImage
                                        src='/static/images/information.svg'
                                        alt='Balance information'
                                        width={24}
                                        height={24}
                                    />
                                    <TooltipContentContainerHeaders>
                                        <span>Attesting Balance</span>
                                        <span>vs</span>
                                        <span>Total Active Balance</span>
                                    </TooltipContentContainerHeaders>
                                </TooltipContainer>
                            </div>
                            <ProgressSmoothBar
                                title='Attesting/total active'
                                bg='#0016D8'
                                color='#BDC4FF'
                                percent={epoch.f_num_att_vals / epoch.f_num_vals}
                                tooltipColor='bluedark'
                                tooltipContent={
                                    <>
                                        <span>
                                            Att. Balance: {epoch.f_att_effective_balance_eth?.toLocaleString()} ETH
                                        </span>
                                        <span>
                                            Act. Balance: {epoch.f_total_effective_balance_eth?.toLocaleString()} ETH
                                        </span>
                                    </>
                                }
                            />
                        </div>
                    </div>
                ))}

            <button
                className='cursor-pointer mx-auto w-fit text-[10px] text-black rounded-[22px] px-3 py-4'
                onClick={handleClick}
                style={{
                    backgroundColor: themeMode?.darkMode ? 'var(--yellow2)' : 'var(--blue1)',
                    boxShadow: themeMode?.darkMode ? 'var(--boxShadowYellow1)' : 'var(--boxShadowBlue1)',
                }}
            >
                VIEW MORE
            </button>
        </div>
    );

    return (
        <div className='text-center text-white'>
            <h1 className='text-lg md:text-3xl uppercase'>Epoch Statistics</h1>

            {desktopView ? getDesktopView() : getPhoneView()}

            {loadingEpochs && (
                <div className='mt-6'>
                    <Loader />
                </div>
            )}
        </div>
    );
};

export default Statitstics;

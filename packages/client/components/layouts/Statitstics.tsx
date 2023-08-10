import React, { useEffect, useRef, useState, useCallback, useContext } from 'react';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';
import BlocksContext from '../../contexts/blocks/BlocksContext';
import EpochsContext from '../../contexts/epochs/EpochsContext';

// Components
import ProgressTileBar from '../ui/ProgressTileBar';
import ProgressSmoothBar from '../ui/ProgressSmoothBar';
import Loader from '../ui/Loader';
import TooltipContainer from '../ui/TooltipContainer';
import CustomImage from '../ui/CustomImage';
import TooltipResponsive from '../ui/TooltipResponsive';
import ViewMoreButton from '../ui/ViewMoreButton';
import LinkEpoch from '../ui/LinkEpoch';

// Types
import { Epoch, Block } from '../../types';

// Constants
const firstBlock: number = Number(process.env.NEXT_PUBLIC_NETWORK_GENESIS);

const Statitstics = () => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    // Blocks Context
    const { blocks, getBlocks } = useContext(BlocksContext) ?? {};

    // Epochs Context
    const { epochs, getEpochs } = useContext(EpochsContext) ?? {};

    // Refs
    const containerRef = useRef<HTMLInputElement>(null);

    // States
    const [desktopView, setDesktopView] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [loadingBlocks, setLoadingBlocks] = useState(false);
    const [loadingEpochs, setLoadingEpochs] = useState(false);
    const [calculatingText, setCalculatingText] = useState('');

    useEffect(() => {
        // Fetching blocks
        if (blocks && !blocks.epochs && !loadingBlocks) {
            setLoadingBlocks(true);
            getBlocks?.(0);
        }

        // Fetching epochs
        if (epochs && epochs.epochs.length === 0 && !loadingEpochs) {
            setLoadingEpochs(true);
            getEpochs?.(0);
        }

        if (epochs && epochs.epochs.length > 0 && loadingEpochs) {
            setLoadingEpochs(false);
        }

        setDesktopView(window !== undefined && window.innerWidth > 768);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blocks, epochs]);

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

    const handleViewMore = async () => {
        setLoadingEpochs(true);
        await getEpochs?.(currentPage + 1);
        setCurrentPage(prevState => prevState + 1);
        // setLoadingEpochs(false); -> No need to set it to false because it will be set to false in the useEffect
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
                    <LinkEpoch epoch={f_epoch} mxAuto />
                </div>
                <div className='w-[15%] pt-3.5 mb-5'>
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
                    <LinkEpoch epoch={f_epoch}>
                        <p className='font-bold text-sm mt-0.5'>Epoch {f_epoch?.toLocaleString()}</p>
                    </LinkEpoch>
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

                            <TooltipResponsive
                                width={220}
                                backgroundColor='white'
                                colorLetter='black'
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

                            <TooltipResponsive
                                width={220}
                                backgroundColor='white'
                                colorLetter='black'
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
                        <p className='text-xs mt-1'>Attestation Accuracy</p>
                        <TooltipContainer>
                            <CustomImage
                                src='/static/images/information.svg'
                                alt='Attestation Accuracy information'
                                width={24}
                                height={24}
                            />

                            <TooltipResponsive
                                width={250}
                                backgroundColor='white'
                                colorLetter='black'
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
                        <p className='text-xs mt-1'>Voting Participation</p>

                        <TooltipContainer>
                            <CustomImage
                                src='/static/images/information.svg'
                                alt='Attestation Accuracy information'
                                width={24}
                                height={24}
                            />

                            <TooltipResponsive
                                width={200}
                                backgroundColor='white'
                                colorLetter='black'
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
            <div className='flex gap-x-1 justify-around px-2 xl:px-8 pb-3 uppercase text-sm min-w-[1150px]'>
                <div className='flex w-[10%] items-center gap-x-1 justify-center'>
                    <p className='mt-0.5 text-xs'>Time</p>
                    <TooltipContainer>
                        <CustomImage
                            src='/static/images/information.svg'
                            alt='Time information'
                            width={24}
                            height={24}
                        />

                        <TooltipResponsive
                            width={220}
                            backgroundColor='white'
                            colorLetter='black'
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
                    </TooltipContainer>
                </div>

                <div className='flex w-[11%] items-center gap-x-1 justify-center'>
                    <p className='mt-0.5 text-xs'>Epoch</p>
                    <TooltipContainer>
                        <CustomImage
                            src='/static/images/information.svg'
                            alt='Time information'
                            width={24}
                            height={24}
                        />

                        <TooltipResponsive
                            width={130}
                            backgroundColor='white'
                            colorLetter='black'
                            content={<span>Epoch number</span>}
                            top='34px'
                        />
                    </TooltipContainer>
                </div>

                <div className='flex w-[15%] items-center gap-x-1 justify-center'>
                    <p className='mt-0.5 text-xs'>Blocks</p>
                    <TooltipContainer>
                        <CustomImage
                            src='/static/images/information.svg'
                            alt='Blocks information'
                            width={24}
                            height={24}
                        />

                        <TooltipResponsive
                            width={220}
                            backgroundColor='white'
                            colorLetter='black'
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

                <div className='flex w-[32%] items-center gap-x-1 justify-center'>
                    <p className='mt-0.5 text-xs'>Attestation Accuracy</p>
                    <TooltipContainer>
                        <CustomImage
                            src='/static/images/information.svg'
                            alt='Attestation Accuracy information'
                            width={24}
                            height={24}
                        />

                        <TooltipResponsive
                            width={240}
                            backgroundColor='white'
                            colorLetter='black'
                            content={
                                <>
                                    <span>Correctly Attested Flag Count</span>
                                    <span>vs</span>
                                    <span>Expected Attesting Flag Count</span>
                                </>
                            }
                            top='34px'
                        />
                    </TooltipContainer>
                </div>

                <div className='flex w-[32%] items-center gap-x-1 justify-center'>
                    <p className='mt-0.5 text-xs'>Voting Participation</p>
                    <TooltipContainer>
                        <CustomImage
                            src='/static/images/information.svg'
                            alt='Balance information'
                            width={24}
                            height={24}
                        />

                        <TooltipResponsive
                            width={180}
                            backgroundColor='white'
                            colorLetter='black'
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
                    epochs.epochs.map((epoch: Epoch) => (
                        <div
                            key={epoch.f_epoch}
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
                                <LinkEpoch epoch={epoch.f_epoch} mxAuto />
                            </div>

                            <div className='w-[15%] pt-3.5 mb-5'>
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
                                            color='#E86506'
                                            backgroundColor='#FFC163'
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
                                            widthTooltip={220}
                                        />
                                    </div>
                                    <div className='flex-1'>
                                        <ProgressSmoothBar
                                            title='Source'
                                            color='#14946e'
                                            backgroundColor='#BDFFEB'
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
                                            widthTooltip={220}
                                        />
                                    </div>
                                    <div className='flex-1'>
                                        <ProgressSmoothBar
                                            title='Head'
                                            color='#532BC5'
                                            backgroundColor='#E6DDFF'
                                            percent={1 - epoch.f_missing_head / epoch.f_num_vals}
                                            tooltipColor='purple'
                                            tooltipContent={
                                                <>
                                                    <span>Missing Head: {epoch.f_missing_head?.toLocaleString()}</span>
                                                    <span>Attestations: {epoch.f_num_vals?.toLocaleString()}</span>
                                                </>
                                            }
                                            widthTooltip={220}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className='mb-2 w-[32%]'>
                                <ProgressSmoothBar
                                    title='Attesting/total active'
                                    color='#0016D8'
                                    backgroundColor='#BDC4FF'
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
                                    widthTooltip={270}
                                />
                            </div>
                        </div>
                    ))}

                {loadingEpochs && (
                    <div className='mt-6'>
                        <Loader />
                    </div>
                )}

                <ViewMoreButton onClick={handleViewMore} />
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
                epochs.epochs.map((epoch: Epoch) => (
                    <div
                        key={epoch.f_epoch}
                        className='flex flex-col gap-y-4 justify-around items-center text-[10px] text-black rounded-[22px] px-3 py-4'
                        style={{
                            backgroundColor: themeMode?.darkMode ? 'var(--yellow2)' : 'var(--blue1)',
                            boxShadow: themeMode?.darkMode ? 'var(--boxShadowYellow1)' : 'var(--boxShadowBlue1)',
                        }}
                    >
                        <div className='flex gap-x-1 justify-center'>
                            <LinkEpoch epoch={epoch.f_epoch}>
                                <p className='font-bold text-sm mt-0.5'>Epoch {epoch.f_epoch?.toLocaleString()}</p>
                            </LinkEpoch>
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

                                    <TooltipResponsive
                                        width={220}
                                        backgroundColor='white'
                                        colorLetter='black'
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
                                <p>{new Date(firstBlock + epoch.f_epoch * 32 * 12000).toLocaleDateString('ja-JP')}</p>
                                <p>{new Date(firstBlock + epoch.f_epoch * 32 * 12000).toLocaleTimeString('ja-JP')}</p>
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

                                    <TooltipResponsive
                                        width={220}
                                        backgroundColor='white'
                                        colorLetter='black'
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
                                <p className='text-xs mt-1'>Attestation Accuracy</p>
                                <TooltipContainer>
                                    <CustomImage
                                        src='/static/images/information.svg'
                                        alt='Attestation Accuracy information'
                                        width={24}
                                        height={24}
                                    />

                                    <TooltipResponsive
                                        width={240}
                                        backgroundColor='white'
                                        colorLetter='black'
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
                                title='Target'
                                color='#E86506'
                                backgroundColor='#FFC163'
                                percent={1 - epoch.f_missing_target / epoch.f_num_vals}
                                tooltipColor='orange'
                                tooltipContent={
                                    <>
                                        <span>Missing Target: {epoch.f_missing_target?.toLocaleString()}</span>
                                        <span>Attestations: {epoch.f_num_vals?.toLocaleString()}</span>
                                    </>
                                }
                                widthTooltip={220}
                            />

                            <ProgressSmoothBar
                                title='Source'
                                color='#14946e'
                                backgroundColor='#BDFFEB'
                                percent={1 - epoch.f_missing_source / epoch.f_num_vals}
                                tooltipColor='blue'
                                tooltipContent={
                                    <>
                                        <span>Missing Source: {epoch.f_missing_source?.toLocaleString()}</span>
                                        <span>Attestations: {epoch.f_num_vals?.toLocaleString()}</span>
                                    </>
                                }
                                widthTooltip={220}
                            />

                            <ProgressSmoothBar
                                title='Head'
                                color='#532BC5'
                                backgroundColor='#E6DDFF'
                                percent={1 - epoch.f_missing_head / epoch.f_num_vals}
                                tooltipColor='purple'
                                tooltipContent={
                                    <>
                                        <span>Missing Head: {epoch.f_missing_head?.toLocaleString()}</span>
                                        <span>Attestations: {epoch.f_num_vals?.toLocaleString()}</span>
                                    </>
                                }
                                widthTooltip={220}
                            />
                        </div>

                        <div className='flex flex-col w-full gap-y-2'>
                            <div className='flex gap-x-1 items-center justify-center mb-1'>
                                <p className='text-xs mt-1'>Voting Participation</p>
                                <TooltipContainer>
                                    <CustomImage
                                        src='/static/images/information.svg'
                                        alt='Balance information'
                                        width={24}
                                        height={24}
                                    />

                                    <TooltipResponsive
                                        width={180}
                                        backgroundColor='white'
                                        colorLetter='black'
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
                                title='Attesting/total active'
                                color='#0016D8'
                                backgroundColor='#BDC4FF'
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
                                widthTooltip={270}
                            />
                        </div>
                    </div>
                ))}

            {loadingEpochs && (
                <div className='mt-6'>
                    <Loader />
                </div>
            )}

            <ViewMoreButton onClick={handleViewMore} />
        </div>
    );

    return (
        <div className='text-center text-white'>
            <h2 className='text-lg md:text-2xl uppercase mb-5'>Epoch Statistics</h2>

            {desktopView ? getDesktopView() : getPhoneView()}
        </div>
    );
};

export default Statitstics;

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import styled from '@emotion/styled';
import { useInView } from 'react-intersection-observer';

// Axios
import axiosClient from '../../config/axios';

// Contexts
import StatusContext from '../../contexts/status/StatusContext';
import BlocksContext from '../../contexts/blocks/BlocksContext';

// Components
import ProgressTileBar from '../ui/ProgressTileBar';
import ProgressSmoothBar from '../ui/ProgressSmoothBar';
import Loader from '../ui/Loader';
import { TooltipContainer, TooltipContentContainerHeaders } from '../ui/Tooltips';

// Types
import { Epoch, Block } from '../../types';

// Styled
const Card = styled.div`
    box-shadow: inset -7px -7px 8px #f0c83a, inset 7px 7px 8px #f0c83a;
`;

const CardCalculating = styled.div`
    box-shadow: inset -7px -7px 8px #ec903c, inset 7px 7px 8px #ec903c;
`;

// Constants
const firstBlock: number = 1606824023000;

const Statitstics = () => {
    // Constants
    const ETH_WEI = 1;

    // Status Context
    const { setNotWorking } = React.useContext(StatusContext) || {};

    // Blocks Context
    const { blocks, startEventSource, closeEventSource, getBlocks } = React.useContext(BlocksContext) || {};

    // Intersection Observer
    const { ref, inView } = useInView();

    const conainerRef = useRef<HTMLInputElement>(null);

    // States
    const [epochs, setEpochs] = useState<Epoch[]>([]);
    const [desktopView, setDesktopView] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [lastPageFetched, setLastPageFetched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [eventSourceOpenened, setEventSourceOpenened] = useState(false);
    const [calculatingText, setCalculatingText] = useState('');

    useEffect(() => {
        if (epochs.length === 0) {
            getEpochs(0);
        }

        setDesktopView(window !== undefined && window.innerWidth > 768);

        if (inView && !lastPageFetched) {
            getEpochs(currentPage + 1);
        }

        if (!eventSourceOpenened) {
            const eventSource = new EventSource(
                `${process.env.NEXT_PUBLIC_URL_API}/api/validator-rewards-summary/new-epoch-notification`
            );
            eventSource.addEventListener('new_epoch', function (e) {
                getEpochs(0, 2);
            });
            setEventSourceOpenened(true);

            return () => {
                eventSource.close();
            };
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView]);

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

    useEffect(() => {
        if (blocks && !blocks.epochs) {
            getBlocks?.(0);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blocks]);

    useEffect(() => {
        if (!eventSourceOpenened) {
            startEventSource?.();
            setEventSourceOpenened(true);
        }

        return () => {
            closeEventSource?.();
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleMouseMove = (e: any) => {
        if (conainerRef.current) {
            const x = e.pageX;
            const limit = 0.15;

            if (x < conainerRef.current.clientWidth * limit) {
                conainerRef.current.scrollLeft -= 10;
            } else if (x > conainerRef.current.clientWidth * (1 - limit)) {
                conainerRef.current.scrollLeft += 10;
            }
        }
    };

    // get epochs
    const getEpochs = async (page: number, limit = 10) => {
        try {
            setLoading(true);

            const response = await axiosClient.get('/api/validator-rewards-summary', {
                params: {
                    limit,
                    page,
                },
            });

            if (response.data.epochsStats.length === 0) {
                setLastPageFetched(true);
            } else {
                setEpochs(prevState => {
                    if (prevState.length > 0) {
                        return [
                            ...prevState,
                            ...response.data.epochsStats.filter(
                                (item: any) => !prevState.some(item2 => item.f_epoch === item2.f_epoch)
                            ),
                        ].sort((a, b) => b.f_epoch - a.f_epoch);
                    } else {
                        return response.data.epochsStats;
                    }
                });

                setCurrentPage(page);
            }

            setLoading(false);
        } catch (error) {
            console.log(error);
            setNotWorking?.();
        }
    };

    const createArrayBlocks = (blocks: Block[]) => {
        const arrayBlocks = blocks?.map(element => (element.f_proposed ? 1 : 0));
        return arrayBlocks;
    };

    const getCalculatingEpochDesktop = (f_slot: number, f_epoch: number, blocks: Block[]) => {
        const arrayBlocks = createArrayBlocks(blocks);

        if (!arrayBlocks) {
            return null;
        }

        return (
            <CardCalculating className='flex gap-x-1 justify-around items-center text-[9px] text-black bg-[#FFC163] rounded-[22px] px-2 xl:px-8 py-3'>
                <div className='flex flex-col w-[8%] pt-2.5 pb-2.5'>
                    <p>{new Date(firstBlock + f_epoch * 32 * 12000).toLocaleDateString()}</p>
                    <p>{new Date(firstBlock + f_epoch * 32 * 12000).toLocaleTimeString()}</p>
                </div>
                <p className='w-[9%]'>{f_epoch.toLocaleString()}</p>
                <div className='w-[13%] pt-3.5 mb-6'>
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
                <div className='w-[29%]'>
                    <p className='w-32 uppercase mx-auto text-start'>{calculatingText}</p>
                </div>
                <div className='w-[29%]'>
                    <p className='w-32 uppercase mx-auto text-start'>{calculatingText}</p>
                </div>
                <div className='w-[12%]'>
                    <p className='w-32 uppercase mx-auto text-start'>{calculatingText}</p>
                </div>
            </CardCalculating>
        );
    };

    const getCalculatingEpochMobile = (f_slot: number, f_epoch: number, blocks: Block[]) => {
        const arrayBlocks = createArrayBlocks(blocks);

        if (!arrayBlocks) {
            return null;
        }

        return (
            <CardCalculating className='flex flex-col gap-y-4 justify-around items-center text-[10px] text-black bg-[#FFC163] rounded-[22px] px-3 py-4'>
                <div className='flex gap-x-1 justify-center'>
                    <p className='font-bold text-sm mt-0.5'>Epoch {f_epoch.toLocaleString()}</p>
                </div>
                <div className='flex flex-col gap-x-4 w-full'>
                    <div className='flex gap-x-1 justify-center mb-1'>
                        <p className='text-xs mt-1'>Time</p>
                        <TooltipContainer>
                            <Image src='/static/images/information.svg' alt='Time information' width={24} height={24} />
                            <TooltipContentContainerHeaders>
                                <span>Time at which the epoch</span>
                                <span>should have started</span>
                                <span>(calculated since genesis)</span>
                            </TooltipContentContainerHeaders>
                        </TooltipContainer>
                    </div>
                    <div>
                        <p>{new Date(firstBlock + f_slot * 12000).toLocaleDateString()}</p>
                        <p>{new Date(firstBlock + f_slot * 12000).toLocaleTimeString()}</p>
                    </div>
                </div>
                <div className='flex flex-col w-full'>
                    <div className='flex gap-x-1 justify-center mb-1'>
                        <p className='text-xs mt-1'>Blocks</p>
                        <TooltipContainer>
                            <Image
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
                            <Image
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
                            <Image
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
                <div className='flex flex-col w-full'>
                    <div className='flex gap-x-1 justify-center mb-1'>
                        <p className='text-xs mt-1'>Rewards</p>
                        <TooltipContainer>
                            <Image
                                src='/static/images/information.svg'
                                alt='Blocks information'
                                width={24}
                                height={24}
                            />
                            <TooltipContentContainerHeaders>
                                <span>Achieved Average Reward</span>
                                <span>vs</span>
                                <span>Expected Average Reward</span>
                            </TooltipContentContainerHeaders>
                        </TooltipContainer>
                    </div>
                    <div>
                        <p className='w-32 uppercase mx-auto text-start'>{calculatingText}</p>
                    </div>
                </div>
            </CardCalculating>
        );
    };

    const getCalculatingEpochsDesktop = (f_slot: number, f_epoch: number, blocks: Record<number, Block[]>) => (
        <>
            {getCalculatingEpochDesktop(f_slot + 64, f_epoch + 2, blocks[f_epoch + 2])}
            {getCalculatingEpochDesktop(f_slot + 32, f_epoch + 1, blocks[f_epoch + 1])}
        </>
    );

    const getCalculatingEpochsMobile = (f_slot: number, f_epoch: number, blocks: Record<number, Block[]>) => (
        <>
            {getCalculatingEpochMobile(f_slot + 64, f_epoch + 2, blocks[f_epoch + 2])}
            {getCalculatingEpochMobile(f_slot + 32, f_epoch + 1, blocks[f_epoch + 1])}
        </>
    );

    const getProposedBlocks = (totalBlock: Array<number>) => {
        return totalBlock?.filter(element => element === 1).length;
    };

    const getDesktopView = () => (
        <div
            ref={conainerRef}
            className='flex flex-col px-2 xl:px-20 overflow-x-scroll overflow-y-hidden scrollbar-thin'
            onMouseMove={handleMouseMove}
        >
            <div className='flex gap-x-1 justify-around px-2 xl:px-8 py-3 uppercase text-sm min-w-[1150px]'>
                <div className='flex w-[10%] items-center gap-x-1 justify-center'>
                    <p className='mt-0.5'>Time</p>
                    <TooltipContainer>
                        <Image src='/static/images/information.svg' alt='Time information' width={24} height={24} />
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
                        <Image src='/static/images/information.svg' alt='Time information' width={24} height={24} />
                        <TooltipContentContainerHeaders epoch>
                            <span>Epoch number</span>
                        </TooltipContentContainerHeaders>
                    </TooltipContainer>
                </div>

                <div className='flex w-[15%] items-center gap-x-1 justify-center'>
                    <p className='mt-0.5'>Blocks</p>
                    <TooltipContainer>
                        <Image src='/static/images/information.svg' alt='Blocks information' width={24} height={24} />
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
                        <Image
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
                        <Image src='/static/images/information.svg' alt='Balance information' width={24} height={24} />
                        <TooltipContentContainerHeaders rightSide>
                            <span>Attesting Balance</span>
                            <span>vs</span>
                            <span>Total Active Balance</span>
                        </TooltipContentContainerHeaders>
                    </TooltipContainer>
                </div>
            </div>

            <div className='flex flex-col justify-center gap-y-4 min-w-[1150px]'>
                {epochs.length > 0 &&
                    blocks &&
                    blocks.epochs &&
                    getCalculatingEpochsDesktop(epochs[0].f_slot, epochs[0].f_epoch, blocks.epochs)}
                {epochs.map((epoch: Epoch, idx: number) => (
                    <Card
                        key={epoch.f_epoch}
                        ref={idx === epochs.length - 1 ? ref : undefined}
                        className='flex gap-x-1 justify-around items-center text-[9px] text-black bg-[#FFF0A1] rounded-[22px] px-2 xl:px-8 py-3'
                    >
                        <div className='flex flex-col w-[10%]'>
                            <p>{new Date(firstBlock + epoch.f_epoch * 32 * 12000).toLocaleDateString()}</p>
                            <p>{new Date(firstBlock + epoch.f_epoch * 32 * 12000).toLocaleTimeString()}</p>
                        </div>

                        <p className='w-[11%]'>{epoch.f_epoch.toLocaleString()}</p>

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
                                                <span>Missing Target: {epoch.f_missing_target?.toLocaleString()}</span>
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
                                                <span>Missing Source: {epoch.f_missing_source?.toLocaleString()}</span>
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
                                            Act. Balance: {epoch.f_total_effective_balance_eth?.toLocaleString()} ETH
                                        </span>
                                    </>
                                }
                            />
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );

    const getPhoneView = () => (
        <div className='flex flex-col gap-y-4 uppercase px-4 mt-3'>
            {epochs.length > 0 &&
                blocks &&
                blocks.epochs &&
                getCalculatingEpochsMobile(epochs[0].f_slot, epochs[0].f_epoch, blocks.epochs)}
            {epochs.map((epoch: Epoch, idx: number) => (
                <Card
                    key={epoch.f_epoch}
                    ref={idx === epochs.length - 1 ? ref : undefined}
                    className='flex flex-col gap-y-4 justify-around items-center text-[10px] text-black bg-[#FFF0A2] rounded-[22px] px-3 py-4'
                >
                    <div className='flex gap-x-1 justify-center'>
                        <p className='font-bold text-sm mt-0.5'>Epoch {epoch.f_epoch?.toLocaleString()}</p>
                    </div>
                    <div className='flex flex-col gap-x-4 w-full'>
                        <div className='flex gap-x-1 justify-center mb-1'>
                            <p className='text-xs mt-1'>Time</p>
                            <TooltipContainer>
                                <Image
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
                            <p>{new Date(firstBlock + epoch.f_slot * 12000).toLocaleDateString()}</p>
                            <p>{new Date(firstBlock + epoch.f_slot * 12000).toLocaleTimeString()}</p>
                        </div>
                    </div>

                    <div className='flex flex-col w-full'>
                        <div className='flex gap-x-1 justify-center mb-1'>
                            <p className='text-xs mt-1'>Blocks</p>
                            <TooltipContainer>
                                <Image
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
                                <Image
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
                                <Image
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
                                    <span>Att. Balance: {epoch.f_att_effective_balance_eth?.toLocaleString()} ETH</span>
                                    <span>
                                        Act. Balance: {epoch.f_total_effective_balance_eth?.toLocaleString()} ETH
                                    </span>
                                </>
                            }
                        />
                    </div>

                    <div className='flex  flex-col w-full gap-x-4'>
                        <div className='flex gap-x-1 justify-center mb-1'>
                            <p className='text-xs mt-1'>Rewards</p>
                            <TooltipContainer>
                                <Image
                                    src='/static/images/information.svg'
                                    alt='Rewards information'
                                    width={24}
                                    height={24}
                                />
                                <TooltipContentContainerHeaders>
                                    <span>Achieved Average Reward</span>
                                    <span>vs</span>
                                    <span>Expected Average Reward</span>
                                </TooltipContentContainerHeaders>
                            </TooltipContainer>
                        </div>
                        <div className='flex-1'>
                            <ProgressSmoothBar
                                title=''
                                bg='#D80068'
                                color='#FFBDD9'
                                percent={Number(epoch.reward_average) / Number(epoch.max_reward_average)}
                                tooltipColor='pink'
                                tooltipContent={
                                    <>
                                        <span>Reward: {Number(epoch.reward_average)?.toLocaleString()} GWEI</span>
                                        <span>
                                            Max. Reward: {Number(epoch.max_reward_average)?.toLocaleString()} GWEI
                                        </span>
                                    </>
                                }
                            />
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );

    return (
        <div className='text-center text-white'>
            <h1 className='text-lg md:text-3xl uppercase'>Epoch Statistics</h1>

            {desktopView ? getDesktopView() : getPhoneView()}

            {loading && (
                <div className='mt-6'>
                    <Loader />
                </div>
            )}
        </div>
    );
};

export default Statitstics;

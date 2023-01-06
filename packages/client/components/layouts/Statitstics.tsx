import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useInView } from 'react-intersection-observer';

// Axios
import axiosClient from '../../config/axios';

// Components
import ProgressTileBar from '../ui/ProgressTileBar';
import ProgressSmoothBar from '../ui/ProgressSmoothBar';
import { TooltipContainer, TooltipContentContainerStats } from '../ui/Tooltips';

// Styled
const Card = styled.div`
    box-shadow: inset -7px -7px 8px #f0c83a, inset 7px 7px 8px #f0c83a;
`;

// Constants
const firstBlock: number = 1606824023000;

type Epoch = {
    f_epoch: number;
    f_slot: number;
    f_num_att_vals: number;
    f_num_vals: number;
    f_att_effective_balance_eth: number;
    f_total_effective_balance_eth: number;
    f_missing_source: number;
    f_missing_target: number;
    f_missing_head: number;
    reward_average: string;
    max_reward_average: string;
    proposed_blocks: string;
};

const Statitstics = () => {
    // Constants
    const ETH_WEI = 1;
    // Intersection Observer
    const { ref, inView } = useInView();

    // States
    const [epochs, setEpochs] = useState<Epoch[]>([]);
    const [desktopView, setDesktopView] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [lastPageFetched, setLastPageFetched] = useState(false);

    useEffect(() => {
        if (epochs.length === 0) {
            getEpochs(0);
        }

        setDesktopView(window !== undefined && window.innerWidth > 768);

        if (inView && !lastPageFetched) {
            getEpochs(currentPage + 1);
        }

        const eventSource = new EventSource(
            `${process.env.NEXT_PUBLIC_URL_API}/api/validator-rewards-summary/new-epoch-notification`
        );
        eventSource.addEventListener('new_epoch', function (e) {
            getEpochs(0, 2);
        });

        return () => {
            eventSource.close();
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView]);

    // get epochs
    const getEpochs = async (page: number, limit = 10) => {
        try {
            const response = await axiosClient.get('/api/validator-rewards-summary/', {
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
        } catch (error) {
            console.log(error);
        }
    };

    const getDesktopView = () => (
        <div className='flex flex-col px-20'>
            <div className='flex gap-x-1 justify-around px-8 py-3  uppercase text-sm'>
                <div className='flex w-1/12 mx-auto justify-center'>
                    <p className=' ml-5 mt-0.5'>Time</p>
                    <TooltipContainer>
                        <Image
                            className='ml-1'
                            src='/static/images/information.svg'
                            alt='Blocks'
                            width={30}
                            height={30}
                        />
                        <TooltipContentContainerStats tooltipColor={'white'} colorLetter={'#000000'}>
                            <span>Time</span>
                        </TooltipContentContainerStats>
                    </TooltipContainer>
                </div>

                <div className='flex w-1/12 mx-auto justify-center'>
                    <p className=' ml-10 mt-0.5'>Epoch</p>
                    <TooltipContainer>
                        <Image
                            className=' ml-1'
                            src='/static/images/information.svg'
                            alt='Blocks'
                            width={30}
                            height={30}
                        />
                        <TooltipContentContainerStats tooltipColor={'white'} colorLetter={'#000000'}>
                            <span>Epoch</span>
                        </TooltipContentContainerStats>
                    </TooltipContainer>
                </div>
                <div className='flex w-2/12 mx-auto justify-center'>
                    <p className='ml-5 mt-0.5'>Blocks</p>
                    <TooltipContainer>
                        <Image
                            className='ml-1'
                            src='/static/images/information.svg'
                            alt='Blocks'
                            width={30}
                            height={30}
                        />
                        <TooltipContentContainerStats tooltipColor={'white'} colorLetter={'#000000'}>
                            <span>Blocks</span>
                        </TooltipContentContainerStats>
                    </TooltipContainer>
                </div>
                <div className='flex w-4/12 mx-auto justify-center'>
                    <p className=' mt-0.5'>Attestation Accuracy</p>
                    <TooltipContainer>
                        <Image
                            className='ml-1'
                            src='/static/images/information.svg'
                            alt='Blocks'
                            width={30}
                            height={30}
                        />
                        <TooltipContentContainerStats tooltipColor={'white'} colorLetter={'#000000'}>
                            <span>Attestation Accuracy</span>
                        </TooltipContentContainerStats>
                    </TooltipContainer>
                </div>
                <div className='flex w-3/12 mx-auto justify-center'>
                    <p className='mt-0.5'>Balance</p>
                    <TooltipContainer>
                        <Image
                            className='ml-1'
                            src='/static/images/information.svg'
                            alt='Blocks'
                            width={30}
                            height={30}
                        />
                        <TooltipContentContainerStats tooltipColor={'white'} colorLetter={'#000000'}>
                            <span>Balance</span>
                        </TooltipContentContainerStats>
                    </TooltipContainer>
                </div>
                <div className='flex w-1/12'>
                    <p className='mt-0.5'>Rewards</p>
                    <TooltipContainer>
                        <Image
                            className='ml-1'
                            src='/static/images/information.svg'
                            alt='Blocks'
                            width={30}
                            height={30}
                        />
                        <TooltipContentContainerStats tooltipColor={'white'} colorLetter={'#000000'}>
                            <span>Rewards</span>
                        </TooltipContentContainerStats>
                    </TooltipContainer>
                </div>
            </div>

            <div className='flex flex-col justify-center gap-y-4'>
                {epochs.map((epoch: Epoch, idx: number) => (
                    <Card
                        key={epoch.f_epoch}
                        ref={idx === epochs.length - 1 ? ref : undefined}
                        className='flex gap-x-3 justify-around items-center text-[9px] text-black bg-[#FFF0A1] rounded-[22px] px-8 py-3'
                    >
                        <div className='flex flex-col w-1/12'>
                            <p>{new Date(firstBlock + epoch.f_slot * 12000).toLocaleDateString()}</p>
                            <p>{new Date(firstBlock + epoch.f_slot * 12000).toLocaleTimeString()}</p>
                        </div>

                        <p className='w-1/12'>{epoch.f_epoch.toLocaleString()}</p>

                        <div className='w-2/12 pt-4 mb-2'>
                            <ProgressTileBar
                                tilesFilled={Number(epoch.proposed_blocks)}
                                totalTiles={32}
                                tooltipContent={
                                    <>
                                        <span>Proposed Blocks: {epoch.proposed_blocks}</span>
                                        <span>Missed Blocks: {32 - Number(epoch.proposed_blocks)}</span>
                                    </>
                                }
                            />
                        </div>

                        <div className='mb-2 w-4/12'>
                            <div className='flex gap-x-1 justify-center '>
                                <div className='flex-1'>
                                    <ProgressSmoothBar
                                        title='Target'
                                        bg='#D17E00'
                                        color='#FFC163'
                                        percent={1 - epoch.f_missing_target / epoch.f_num_vals}
                                        tooltipColor='orange'
                                        tooltipContent={
                                            <>
                                                <span>Missing Target: {epoch.f_missing_target.toLocaleString()}</span>
                                                <span>Attestations: {epoch.f_num_vals.toLocaleString()}</span>
                                            </>
                                        }
                                    />
                                </div>
                                <div className='flex-1'>
                                    <ProgressSmoothBar
                                        title='Source'
                                        bg='#00C5D1'
                                        color='#94F9FF'
                                        percent={1 - epoch.f_missing_source / epoch.f_num_vals}
                                        tooltipColor='blue'
                                        tooltipContent={
                                            <>
                                                <span>Missing Source: {epoch.f_missing_source.toLocaleString()}</span>
                                                <span>Attestations: {epoch.f_num_vals.toLocaleString()}</span>
                                            </>
                                        }
                                    />
                                </div>
                                <div className='flex-1'>
                                    <ProgressSmoothBar
                                        title='Head'
                                        bg='#8F76D6'
                                        color='#CAB8FF'
                                        percent={1 - epoch.f_missing_head / epoch.f_num_vals}
                                        tooltipColor='purple'
                                        tooltipContent={
                                            <>
                                                <span>Missing Head: {epoch.f_missing_head.toLocaleString()}</span>
                                                <span>Attestations: {epoch.f_num_vals.toLocaleString()}</span>
                                            </>
                                        }
                                    />
                                </div>
                            </div>

                           
                        </div>

                        <div className='mb-2  w-3/12'>
                            <ProgressSmoothBar
                                title='Attesting/total active'
                                bg='#0016D8'
                                color='#BDC4FF'
                                percent={epoch.f_num_att_vals / epoch.f_num_vals}
                                tooltipColor='bluedark'
                                tooltipContent={
                                    <>
                                        <span>R. Attestations: {epoch.f_num_att_vals.toLocaleString()}</span>
                                        <span>Attestations: {epoch.f_num_vals.toLocaleString()}</span>
                                    </>
                                }
                            />
                            
                        </div>

                        <div className='w-1/12'>
                            <ProgressSmoothBar
                                title=''
                                bg='#bc00d8'
                                color='#ffbdd9'
                                percent={Number(epoch.reward_average) / Number(epoch.max_reward_average)}
                                tooltipColor='pink'
                                tooltipContent={
                                    <>
                                        <span>
                                            Reward:{' '}
                                            {Number(
                                                (Number(epoch.reward_average) / ETH_WEI).toFixed(3)
                                            ).toLocaleString()}{' '}
                                            WEI
                                        </span>
                                        <span>
                                            M. Reward:{' '}
                                            {Number(
                                                (Number(epoch.max_reward_average) / ETH_WEI).toFixed(3)
                                            ).toLocaleString()}{' '}
                                            WEI
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
            {epochs.map((epoch: Epoch, idx: number) => (
                <Card
                    key={epoch.f_epoch}
                    ref={idx === epochs.length - 1 ? ref : undefined}
                    className='flex flex-col gap-y-4 justify-around items-center text-xs text-black bg-[#FFF0A2] rounded-[22px] p-3'
                >
                    <p className='font-bold'>Epoch {epoch.f_epoch.toLocaleString()}</p>

                    <div className='flex gap-x-4 w-full'>
                        <div>
                            <p className='uppercase'>Slot</p>
                            <p>{epoch.f_slot}</p>
                        </div>
                        <div>
                            <ProgressTileBar
                                tilesFilled={32}
                                totalTiles={32}
                                hasImage
                                statsInside
                                tooltipContent={
                                    <>
                                        <span>Proposed Blocks: {epoch.proposed_blocks}</span>
                                        <span>Missed Blocks: {32 - Number(epoch.proposed_blocks)}</span>
                                    </>
                                }
                                mobile
                            />
                        </div>
                    </div>

                    <div className='flex flex-col w-full gap-y-2'>
                        <p>Attestation Accuracy</p>

                        <ProgressSmoothBar
                            title='Target'
                            bg='#D17E00'
                            color='#FFC163'
                            percent={1 - epoch.f_missing_target / epoch.f_num_vals}
                            tooltipColor='orange'
                            tooltipContent={
                                <>
                                    <span>Missing Target: {epoch.f_missing_target.toLocaleString()}</span>
                                    <span>Attestations: {epoch.f_num_vals.toLocaleString()}</span>
                                </>
                            }
                        />

                        <ProgressSmoothBar
                            title='Source'
                            bg='#00C5D1'
                            color='#94F9FF'
                            percent={1 - epoch.f_missing_source / epoch.f_num_vals}
                            tooltipColor='blue'
                            tooltipContent={
                                <>
                                    <span>Proposed Blocks: {epoch.proposed_blocks}</span>
                                    <span>Missed Blocks: {32 - Number(epoch.proposed_blocks)}</span>
                                </>
                            }
                        />

                        <ProgressSmoothBar
                            title='Head'
                            bg='#8F76D6'
                            color='#CAB8FF'
                            percent={1 - epoch.f_missing_head / epoch.f_num_vals}
                            tooltipColor='purple'
                            tooltipContent={
                                <>
                                    <span>Missing Head: {epoch.f_missing_head.toLocaleString()}</span>
                                    <span>Attestations: {epoch.f_num_vals.toLocaleString()}</span>
                                </>
                            }
                        />

                        <p className='text-center'>
                            {epoch.f_num_att_vals.toLocaleString()} / {epoch.f_num_vals.toLocaleString()}
                        </p>
                    </div>

                    <div className='flex flex-col w-full gap-y-2'>
                        <p>Balance</p>

                        <ProgressSmoothBar
                            title='Attesting/total active'
                            bg='#0016D8'
                            color='#BDC4FF'
                            percent={epoch.f_num_att_vals / epoch.f_num_vals}
                            tooltipColor='bluedark'
                            tooltipContent={
                                <>
                                    <span>R. Attestations: {epoch.f_num_att_vals.toLocaleString()}</span>
                                    <span>Attestations: {epoch.f_num_vals.toLocaleString()}</span>
                                </>
                            }
                        />

                        <p>
                            {epoch.f_att_effective_balance_eth.toLocaleString()} /{' '}
                            {epoch.f_total_effective_balance_eth.toLocaleString()}
                        </p>
                    </div>

                    <div className='flex w-full gap-x-4'>
                        <Image className='mx-auto' src='/static/images/cup.svg' alt='Blocks' width={30} height={30} />

                        <div className='flex-1'>
                            <ProgressSmoothBar
                                title='Reward'
                                bg='#bc00d8'
                                color='#ffbdd9'
                                percent={Number(epoch.reward_average) / Number(epoch.max_reward_average)}
                                tooltipColor='pink'
                                tooltipContent={
                                    <>
                                        <span>Reward: {Number(epoch.reward_average).toLocaleString()} WEI</span>
                                        <span>M. Reward: {Number(epoch.max_reward_average).toLocaleString()} WEI</span>
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
        </div>
    );
};

export default Statitstics;

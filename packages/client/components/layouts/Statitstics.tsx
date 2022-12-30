import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useInView } from 'react-intersection-observer';

// Axios
import axiosClient from '../../config/axios';

// Components
import ProgressTileBar from '../ui/ProgressTileBar';
import ProgressSmoothBar from '../ui/ProgressSmoothBar';

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

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView]);

    // get epochs
    const getEpochs = async (page: number) => {
        try {
            const response = await axiosClient.get('/api/validator-rewards-summary/', {
                params: {
                    limit: 4,
                    page,
                },
            });

            if (response.data.epochsStats.length === 0) {
                setLastPageFetched(true);
            } else {
                const aux = [...epochs, ...response.data.epochsStats];
                setEpochs(aux);
                setCurrentPage(page);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getDesktopView = () => (
        <div className='flex flex-col px-20'>
            <div className='flex gap-x-1 justify-around px-5 py-3 items-center uppercase text-sm'>
                <p className='w-1/12'>Time</p>
                <p className='w-1/12'>Epoch</p>
                <p className='w-2/12'>Blocks</p>
                <p className='w-4/12'>Attestation Accuracy</p>
                <p className='w-3/12'>Balance</p>
                <p className='w-1/12'>Rewards</p>
            </div>

            <div className='flex flex-col gap-y-4'>
                {epochs.map((epoch: Epoch, idx: number) => (
                    <Card
                        key={epoch.f_epoch}
                        ref={idx === epochs.length - 1 ? ref : undefined}
                        className='flex gap-x-3 justify-around items-center text-[9px] text-black bg-[#FFF0A1] rounded-[22px] px-5 py-3'
                    >
                        <div className='flex flex-col w-1/12'>
                            <p>{new Date(firstBlock + epoch.f_slot * 12000).toLocaleDateString()}</p>
                            <p>{new Date(firstBlock + epoch.f_slot * 12000).toLocaleTimeString()}</p>
                        </div>
                        <p className='w-1/12'>{epoch.f_epoch}</p>
                        <div className='w-2/12 pt-4'>
                            <ProgressTileBar
                                tilesFilled={Number(epoch.proposed_blocks)}
                                totalTiles={32}
                                tooltipLines={[
                                    `Proposed Blocks: ${epoch.proposed_blocks}`,
                                    `Missed Blocks: ${32 - Number(epoch.proposed_blocks)}`,
                                ]}
                            />
                        </div>

                        <div className='flex flex-col w-4/12'>
                            <div className='flex gap-x-1 justify-center '>
                                <div className='flex-1'>
                                    <ProgressSmoothBar
                                        title='Target'
                                        bg='#D17E00'
                                        color='#FFC163'
                                        percent={1 - epoch.f_missing_target / epoch.f_num_vals}
                                        tooltipLines={[
                                            `Missing Target: ${epoch.f_missing_target}`,
                                            `Attestations: ${epoch.f_num_vals}`,
                                        ]}
                                        tooltipColor='orange'
                                    />
                                </div>
                                <div className='flex-1'>
                                    <ProgressSmoothBar
                                        title='Source'
                                        bg='#00C5D1'
                                        color='#94F9FF'
                                        percent={1 - epoch.f_missing_source / epoch.f_num_vals}
                                        tooltipLines={[
                                            `Missing Source: ${epoch.f_missing_source}`,
                                            `Attestations: ${epoch.f_num_vals}`,
                                        ]}
                                        tooltipColor='blue'
                                    />
                                </div>
                                <div className='flex-1'>
                                    <ProgressSmoothBar
                                        title='Head'
                                        bg='#8F76D6'
                                        color='#CAB8FF'
                                        percent={1 - epoch.f_missing_head / epoch.f_num_vals}
                                        tooltipLines={[
                                            `Missing Head: ${epoch.f_missing_head}`,
                                            `Attestations: ${epoch.f_num_vals}`,
                                        ]}
                                        tooltipColor='purple'
                                    />
                                </div>
                            </div>

                            <p className='text-center'>
                                {epoch.f_num_att_vals} / {epoch.f_num_vals}
                            </p>
                        </div>

                        <div className='flex flex-col w-3/12'>
                            <ProgressSmoothBar
                                title='Attesting/total active'
                                bg='#0016D8'
                                color='#BDC4FF'
                                percent={epoch.f_num_att_vals / epoch.f_num_vals}
                                tooltipLines={[
                                    `R. Attestations: ${epoch.f_num_att_vals}`,
                                    `Attestations: ${epoch.f_num_vals}`,
                                ]}
                                tooltipColor='bluedark'
                            />
                            <p>
                                {epoch.f_att_effective_balance_eth} / {epoch.f_total_effective_balance_eth}
                            </p>
                        </div>

                        <div className='w-1/12'>
                            <ProgressSmoothBar
                                title=''
                                bg='#bc00d8'
                                color='#ffbdd9'
                                percent={Number(epoch.reward_average) / Number(epoch.max_reward_average)}
                                tooltipLines={[
                                    `Reward: ${(Number(epoch.reward_average) / ETH_WEI).toFixed(3)} WEI`,
                                    `M. Reward: ${(Number(epoch.max_reward_average) / ETH_WEI).toFixed(3)} WEI`,
                                ]}
                                tooltipColor='pink'
                            />
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );

    const getPhoneView = () => (
        <div className='flex flex-col gap-y-4 uppercase px-4 mt-3'>
            {epochs.map((epoch: Epoch) => (
                <Card
                    key={epoch.f_epoch}
                    className='flex flex-col gap-y-4 justify-around items-center text-lg text-black bg-[#FFF0A2] rounded-lg p-3'
                >
                    <p className='font-bold'>Epoch {epoch.f_epoch}</p>

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
                                tooltipLines={[
                                    `Proposed Blocks: ${epoch.proposed_blocks}`,
                                    `Missed Blocks: ${32 - Number(epoch.proposed_blocks)}`,
                                ]}
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
                            tooltipLines={[
                                `Missing Target: ${epoch.f_missing_target}`,
                                `Attestations: ${epoch.f_num_vals}`,
                            ]}
                            tooltipColor='orange'
                        />

                        <ProgressSmoothBar
                            title='Source'
                            bg='#00C5D1'
                            color='#94F9FF'
                            percent={1 - epoch.f_missing_source / epoch.f_num_vals}
                            tooltipLines={[
                                `Missing Source: ${epoch.f_missing_source}`,
                                `Attestations: ${epoch.f_num_vals}`,
                            ]}
                            tooltipColor='blue'
                        />

                        <ProgressSmoothBar
                            title='Head'
                            bg='#8F76D6'
                            color='#CAB8FF'
                            percent={1 - epoch.f_missing_head / epoch.f_num_vals}
                            tooltipLines={[
                                `Missing Head: ${epoch.f_missing_head}`,
                                `Attestations: ${epoch.f_num_vals}`,
                            ]}
                            tooltipColor='purple'
                        />

                        <p className='text-center'>
                            {epoch.f_num_att_vals} / {epoch.f_num_vals}
                        </p>
                    </div>

                    <div className='flex flex-col w-full gap-y-2'>
                        <p>Balance</p>

                        <ProgressSmoothBar
                            title='Attesting/total active'
                            bg='#0016D8'
                            color='#BDC4FF'
                            percent={epoch.f_num_att_vals / epoch.f_num_vals}
                            tooltipLines={[
                                `R. Attestations: ${epoch.f_num_att_vals}`,
                                `Attestations: ${epoch.f_num_vals}`,
                            ]}
                            tooltipColor='bluedark'
                        />

                        <p>
                            {epoch.f_att_effective_balance_eth} / {epoch.f_total_effective_balance_eth}
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
                                tooltipLines={[
                                    `Reward: ${(Number(epoch.reward_average) / ETH_WEI).toFixed(3)} WEI`,
                                    `M. Reward: ${(Number(epoch.max_reward_average) / ETH_WEI).toFixed(3)} WEI`,
                                ]}
                                tooltipColor='pink'
                            />
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );

    return (
        <div className='text-center text-white'>
            <h1 className='text-xl md:text-3xl uppercase'>Epoch Statistics</h1>

            {desktopView ? getDesktopView() : getPhoneView()}
        </div>
    );
};

export default Statitstics;

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';

// Axios
import axiosClient from '../../config/axios';

// Components
import ProgressTileBar from '../ui/ProgressTileBar';
import ProgressSmoothBar from '../ui/ProgressSmoothBar';

// Styled
const Card = styled.div`
    box-shadow: inset -5px -5px 4px rgba(227, 203, 75, 0.5), inset 5px 5px 4px rgba(227, 203, 75, 0.5);
`;

type Props = {};

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
};

const Statitstics = (props: Props) => {
    const [epochs, setEpochs] = useState([]);

    useEffect(() => {
        if (epochs.length === 0) {
            getEpochs();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // get epochs
    const getEpochs = async () => {
        try {
            const response = await axiosClient.get('/api/validator-rewards-summary/');
            setEpochs(response.data.epochsStats);
        } catch (error) {
            console.log(error);
        }
    };

    const getDesktopView = () => (
        <div className='flex flex-col px-5'>
            <div className='flex gap-x-1 justify-around py-3 items-center uppercase text-lg'>
                <p className='w-1/12'>Epoch</p>
                <p className='w-1/12'>Slot</p>
                <div className='w-2/12'>
                    <Image
                        className='mx-auto'
                        src='/static/images/blocks_icon.svg'
                        alt='Blocks'
                        width={40}
                        height={40}
                    />
                </div>
                <p className='w-4/12'>Attestation Accuracy</p>
                <p className='w-2/12'>Balance</p>
                <div className='w-1/12'>
                    <Image className='mx-auto' src='/static/images/cup.svg' alt='Blocks' width={30} height={30} />
                </div>
            </div>

            <div className='flex flex-col gap-y-4'>
                {epochs.map((epoch: Epoch) => (
                    <Card
                        key={epoch.f_epoch}
                        className='flex gap-x-1 justify-around items-center text-lg text-black bg-[#FFF0A2] rounded-lg py-3'
                    >
                        <p className='w-1/12'>{epoch.f_epoch}</p>
                        <p className='w-1/12'>{epoch.f_slot}</p>
                        <div className='w-2/12 pt-4'>
                            <ProgressTileBar tilesFilled={32} totalTiles={32} />
                        </div>

                        <div className='flex flex-col w-4/12 mt-7'>
                            <div className='flex gap-x-1 justify-center '>
                                <div className='flex-1'>
                                    <ProgressSmoothBar
                                        title='Target'
                                        bg='#D17E00'
                                        color='#FFC163'
                                        percent={1 - epoch.f_missing_target / epoch.f_num_vals}
                                    />
                                </div>
                                <div className='flex-1'>
                                    <ProgressSmoothBar
                                        title='Source'
                                        bg='#00C5D1'
                                        color='#94F9FF'
                                        percent={1 - epoch.f_missing_source / epoch.f_num_vals}
                                    />
                                </div>
                                <div className='flex-1'>
                                    <ProgressSmoothBar
                                        title='Head'
                                        bg='#8F76D6'
                                        color='#CAB8FF'
                                        percent={1 - epoch.f_missing_head / epoch.f_num_vals}
                                    />
                                </div>
                            </div>

                            <p className='text-center'>
                                {epoch.f_num_att_vals} / {epoch.f_num_vals}
                            </p>
                        </div>

                        <div className='flex flex-col w-2/12 mt-7'>
                            <ProgressSmoothBar
                                title='Attesting/total active'
                                bg='#0016D8'
                                color='#BDC4FF'
                                percent={epoch.f_num_att_vals / epoch.f_num_vals}
                            />
                            <p>
                                {epoch.f_att_effective_balance_eth} / {epoch.f_total_effective_balance_eth}
                            </p>
                        </div>

                        <div className='w-1/12'>
                            <ProgressSmoothBar
                                title='Reward'
                                bg='#bc00d8'
                                color='#ffbdd9'
                                percent={Number(epoch.reward_average) / Number(epoch.max_reward_average)}
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
                            <ProgressTileBar tilesFilled={32} totalTiles={32} hasImage statsInside />
                        </div>
                    </div>

                    <div className='flex flex-col w-full gap-y-2'>
                        <p>Attestation Accuracy</p>

                        <ProgressSmoothBar
                            title='Target'
                            bg='#D17E00'
                            color='#FFC163'
                            percent={1 - epoch.f_missing_target / epoch.f_num_vals}
                        />

                        <ProgressSmoothBar
                            title='Source'
                            bg='#00C5D1'
                            color='#94F9FF'
                            percent={1 - epoch.f_missing_source / epoch.f_num_vals}
                        />

                        <ProgressSmoothBar
                            title='Head'
                            bg='#8F76D6'
                            color='#CAB8FF'
                            percent={1 - epoch.f_missing_head / epoch.f_num_vals}
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
                            />
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );

    return (
        <div className='text-center text-white'>
            <h1 className='text-3xl md:text-5xl uppercase'>Epoch Statistics</h1>

            {typeof window !== 'undefined' && window.innerWidth > 768 ? getDesktopView() : getPhoneView()}
        </div>
    );
};

export default Statitstics;

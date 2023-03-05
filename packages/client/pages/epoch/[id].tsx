import styled from '@emotion/styled';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import Layout from '../../components/layouts/Layout';
import ProgressSmoothBarEpoch from '../../components/ui/ProgressSmoothBarEpoch';
import axiosClient from '../../config/axios';
import { Epoch, Slot } from '../../types';

// Styled
const Card = styled.div`
    box-shadow: inset -7px -7px 8px #f0c83a, inset 7px 7px 8px #f0c83a;
`;

type Props = {
    content: string;
    bg: string;
    color: string;
};
const CardContent = ({ content, bg, color }: Props) => {
    return (
        <span
            className={`mr-5 uppercase  border-2 text-[]  text-[${color}] px-5 py-1.5 rounded-2xl font-bold`}
            style={{ background: color, borderColor: bg, color: bg }}
        >
            {content}
        </span>
    );
};

const Epoch = () => {
    // Next router
    const router = useRouter();
    const {
        query: { id },
    } = router;

    const slotRef = useRef(0);

    const [epoch, setEpoch] = useState<Epoch | null>(null);

    // UseEffect
    useEffect(() => {
        if (id) {
            slotRef.current = Number(id);
        }

        if ((id && !epoch) || (epoch && epoch.f_epoch !== Number(id))) {
            getEpoch();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const getEpoch = async () => {
        const response = await axiosClient.get(`/api/validator-rewards-summary/epoch/${id}`);

        let f_slots = [];
        for (let index = 0; index < 32; index++) {
            f_slots.push({
                f_slot: 13124,
                f_pool_name: 'binance',
                f_proposer_index: 12133,
            });
        }

        setEpoch({
            ...response.data.epoch,
            reward_average: '1223',
            max_reward_average: '1223',
            f_slots,
        });
    };

    const getSlots = (slots: Slot[]) => {
        return (
            <>
                {slots.map((element, idx) => {
                    return (
                        <>
                            <div className='flex flex-col w-[20%]'>
                                <Image
                                    src='/static/images/blocks/block_binance.svg'
                                    alt='Awaiting block'
                                    width={50}
                                    height={50}
                                />
                            </div>
                            <p className='w-[20%] uppercase'>{element.f_pool_name}</p>
                            <p className='w-[20%] uppercase'>{element.f_proposer_index}</p>
                            <p className='w-[20%] uppercase'>{element.f_slot}</p>
                            <p className='w-[20%]'>{new Date(12123324 + 213213 * 32 * 12000).toLocaleDateString()}</p>
                        </>
                    );
                })}
            </>
        );
    };

    const getContentSlots = () => {
        return (
            <div className='flex flex-col px-2 xl:px-20 overflow-x-scroll overflow-y-hidden scrollbar-thin'>
                <div className='flex gap-x-1 justify-around px-2 xl:px-8 py-3 uppercase text-sm min-w-[1150px]'>
                    <div className='flex w-[20%] items-center gap-x-1 justify-center'>
                        <p className='mt-0.5'>Block</p>
                    </div>
                    <div className='flex w-[20%] items-center gap-x-1 justify-center'>
                        <p className='mt-0.5'>Entity</p>
                    </div>
                    <div className='flex w-[20%] items-center gap-x-1 justify-center'>
                        <p className='mt-0.5'>Proposer</p>
                    </div>
                    <div className='flex w-[20%] items-center gap-x-1 justify-center'>
                        <p className='mt-0.5'>Slot</p>
                    </div>
                    <div className='flex w-[20%] items-center gap-x-1 justify-center'>
                        <p className='mt-0.5'>Date Time</p>
                    </div>
                </div>

                <Card className='grid grid-cols-5 md:grid-cols-5 gap-y-5 justify-items-center items-center text-[9px] text-black bg-[#FFF0A1] rounded-[22px] px-2 xl:px-8 py-3'>
                    {epoch && getSlots(epoch.f_slots as Slot[])}
                </Card>
            </div>
        );
    };

    const getAttestation = (title: string, bg: string, color: string, value: number, attestations: number) => {
        return (
            <div className='flex flex-row gap-x-10 ml-5'>
                <p>{title}</p>
                <div className='w-60 text-center'>
                    <ProgressSmoothBarEpoch bg={bg} color={color} percent={1 - value / attestations} />
                </div>
                <div>
                    <CardContent content={`Missing ${title}: ${value}`} bg={bg} color={color} />
                    <CardContent content={`Attestations: ${attestations}`} bg={bg} color={color} />
                </div>
            </div>
        );
    };

    const getContentEpochStats = () => {
        return (
            <div className='flex flex-col px-2 xl:px-20 overflow-x-scroll overflow-y-hidden scrollbar-thin'>
                <Card className='uppercase text-xl items-center text-[9px] text-black bg-[#FFF0A1] rounded-[22px] px-2 xl:px-8 py-3'>
                    <div className='flex flex-row gap-x-10'>
                        <p>epoch number</p>
                        <p>{epoch?.f_epoch}</p>
                    </div>
                    <div className='flex flex-row gap-x-10'>
                        <p>date time</p>
                        <p>{new Date(12123324 + 213213 * 32 * 12000).toLocaleDateString()}</p>
                    </div>
                    <div className='flex flex-row gap-x-10'>
                        <p>blocks</p>
                        <div>
                            <CardContent content={`Proposed: ${epoch?.proposed_blocks}`} bg='#00720B' color='#83E18C' />
                            <CardContent
                                content={`Missed: ${32 - Number(epoch?.proposed_blocks)}`}
                                bg='#980E0E'
                                color='#FF9090'
                            />
                        </div>
                    </div>
                    <div className='flex flex-col gap-y-5'>
                        <p>attestation accuracy</p>
                        {getAttestation(
                            'target',
                            '#E86506',
                            '#FFC163',
                            Number(epoch?.f_missing_target),
                            Number(epoch?.f_num_att_vals)
                        )}
                        {getAttestation(
                            'source',
                            '#14946e',
                            '#BDFFEB',
                            Number(epoch?.f_missing_source),
                            Number(epoch?.f_num_att_vals)
                        )}
                        {getAttestation(
                            'head',
                            '#532BC5',
                            '#E6DDFF',
                            Number(epoch?.f_missing_head),
                            Number(epoch?.f_num_att_vals)
                        )}
                    </div>
                    <div className='flex flex-col'>
                        <p>voting participation</p>
                        <div className='flex flex-row gap-x-10 ml-5'>
                            <div className='w-60 text-center'>
                                <ProgressSmoothBarEpoch
                                    bg='#0016D8'
                                    color='#BDC4FF'
                                    percent={
                                        Number(epoch?.f_att_effective_balance_eth) /
                                        Number(epoch?.f_total_effective_balance_eth)
                                    }
                                />
                            </div>
                            <div className='flex flex-col'>
                                <div className='mb-5'>
                                    <CardContent
                                        content={`Attesting Balance: ${epoch?.f_att_effective_balance_eth?.toLocaleString()} ETH`}
                                        bg='#0016D8'
                                        color='#BDC4FF'
                                    />
                                </div>
                                <div>
                                    <CardContent
                                        content={`Total Active Balance: ${epoch?.f_total_effective_balance_eth?.toLocaleString()} ETH`}
                                        bg='#0016D8'
                                        color='#BDC4FF'
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        );
    };

    const getDesktopView = () => {
        return (
            <div>
                <div>{getContentEpochStats()}</div>
                <div>{getContentSlots()}</div>
            </div>
        );
    };

    return (
        <Layout isMain={false}>
            <div className='flex gap-x-3 justify-center items-center mt-2 mb-5'>
                <Image
                    src='/static/images/arrow-purple.svg'
                    alt='Left arrow'
                    width={15}
                    height={15}
                    className='mb-1 cursor-pointer'
                />

                <h1 className='text-white text-center text-xl md:text-3xl'>Epoch {Number(id)?.toLocaleString()}</h1>

                <Image
                    src='/static/images/arrow-purple.svg'
                    alt='Left arrow'
                    width={15}
                    height={15}
                    className='rotate-180 mb-1 cursor-pointer'
                />
            </div>
            <div className='text-white'>{getDesktopView()}</div>
        </Layout>
    );
};

export default Epoch;

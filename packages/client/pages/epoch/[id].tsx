import styled from '@emotion/styled';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import Layout from '../../components/layouts/Layout';
import ProgressSmoothBarEpoch from '../../components/ui/ProgressSmoothBarEpoch';
import axiosClient from '../../config/axios';
import { POOLS } from '../../constants';
import { Epoch, Slot } from '../../types';

// Constants
const firstBlock: number = 1606824023000;

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
            className='uppercase border-2 px-5 py-1.5 rounded-2xl font-bold'
            style={{ background: color, borderColor: bg, color: bg }}
        >
            {content}
        </span>
    );
};

const EpochComponent = () => {
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

        setEpoch({
            ...response.data.epoch,
        });
    };

    const getBlockImage = (slot: Slot) => {
        const missedExtension = slot.f_proposed ? '' : '_missed';
        if (slot.f_pool_name && POOLS.includes(slot.f_pool_name.toUpperCase())) {
            return (
                <Image
                    src={`/static/images/blocks/block_${slot.f_pool_name.toLowerCase()}${missedExtension}.svg`}
                    alt='Logo'
                    width={60}
                    height={60}
                />
            );
        } else if (slot.f_pool_name && slot.f_pool_name.includes('lido')) {
            return (
                <Image
                    src={`/static/images/blocks/block_lido${missedExtension}.svg`}
                    alt='Logo'
                    width={60}
                    height={60}
                />
            );
        } else if (slot.f_pool_name && slot.f_pool_name.includes('whale')) {
            return (
                <Image
                    src={`/static/images/blocks/block_whale${missedExtension}.svg`}
                    alt='Logo'
                    width={60}
                    height={60}
                />
            );
        } else {
            return (
                <Image
                    src={`/static/images/blocks/block_others${missedExtension}.svg`}
                    alt='Logo'
                    width={60}
                    height={60}
                />
            );
        }
    };

    const getContentSlots = () => {
        return (
            <div className='flex flex-col px-2 xl:px-20 mt-10'>
                <div className='flex gap-x-1 justify-around px-2 xl:px-8 py-3 uppercase text-sm'>
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
                        <p className='mt-0.5'>DateTime</p>
                    </div>
                </div>

                <Card className='flex flex-col gap-y-5 text-xs text-[#D1A128] bg-[#FFF0A1] rounded-[22px] px-2 xl:px-8 py-3'>
                    {epoch?.f_slots?.map(element => (
                        <div
                            className='flex gap-x-1 py-3 uppercase text-center items-center'
                            key={element.f_proposer_slot}
                        >
                            <div className='flex items-center justify-center w-[20%]'>{getBlockImage(element)}</div>
                            <p className='w-[20%]'>{element.f_pool_name !== null ? element.f_pool_name : 'others'}</p>
                            <p className='w-[20%]'>{element.f_val_idx}</p>
                            <p className='w-[20%]'>{element.f_proposer_slot}</p>
                            <p className='w-[20%]'>
                                {new Date(firstBlock + Number(element.f_proposer_slot) * 12000).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </Card>
            </div>
        );
    };

    const getAttestation = (title: string, bg: string, color: string, value: number, attestations: number) => {
        return (
            <div className='flex flex-row gap-x-10 ml-20 items-center'>
                <p className='w-20' style={{ color: bg }}>
                    {title}
                </p>
                <div className='w-64'>
                    <ProgressSmoothBarEpoch bg={bg} color={color} percent={1 - value / attestations} />
                </div>
                <div className='w-64'>
                    <CardContent content={`Missing ${title}: ${value}`} bg={bg} color={color} />
                </div>
                <div>
                    <CardContent content={`Attestations: ${attestations}`} bg={bg} color={color} />
                </div>
            </div>
        );
    };

    const getContentEpochStats = () => {
        return (
            <div className='flex flex-col px-2 xl:px-20 overflow-x-scroll overflow-y-hidden scrollbar-thin'>
                <Card className='uppercase text-xl items-center text-[10px] text-black bg-[#FFF0A1] rounded-[22px] px-2 xl:px-8 py-3'>
                    <div className='flex flex-row gap-x-5'>
                        <p className='w-60'>Epoch Number:</p>
                        <p>{epoch?.f_epoch}</p>
                    </div>
                    <div className='flex flex-row gap-x-5'>
                        <p className='w-60'>DateTime (Local):</p>
                        <p>{new Date(firstBlock + Number(epoch?.f_slot) * 12000).toLocaleString()}</p>
                    </div>
                    <div className='flex flex-row gap-x-5'>
                        <p className='w-60'>Blocks:</p>
                        <div>
                            <CardContent content={`Proposed: ${epoch?.proposed_blocks}`} bg='#00720B' color='#83E18C' />
                        </div>
                        <div>
                            <CardContent
                                content={`Missed: ${32 - Number(epoch?.proposed_blocks)}`}
                                bg='#980E0E'
                                color='#FF9090'
                            />
                        </div>
                    </div>
                    <div className='flex flex-col gap-y-2'>
                        <p>Attestation Accuracy:</p>
                        {getAttestation(
                            'Target',
                            '#E86506',
                            '#FFC163',
                            Number(epoch?.f_missing_target),
                            Number(epoch?.f_num_att_vals)
                        )}
                        {getAttestation(
                            'Source',
                            '#14946e',
                            '#BDFFEB',
                            Number(epoch?.f_missing_source),
                            Number(epoch?.f_num_att_vals)
                        )}
                        {getAttestation(
                            'Head',
                            '#532BC5',
                            '#E6DDFF',
                            Number(epoch?.f_missing_head),
                            Number(epoch?.f_num_att_vals)
                        )}
                    </div>
                    <div className='flex flex-col'>
                        <p>Voting Participation:</p>
                        <div className='flex flex-row gap-x-10 ml-20'>
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
                                <div className='mb-2'>
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
            <div className='mx-auto max-w-[1300px]'>
                <div>{epoch && epoch?.f_slots?.length !== 0 && getContentEpochStats()}</div>
                <div>{epoch && epoch?.f_slots?.length !== 0 && getContentSlots()}</div>
            </div>
        );
    };

    return (
        <Layout isMain={false}>
            <div className='flex gap-x-3 justify-center items-center mt-2 mb-5'>
                <Link href={`/epoch/${id && Number(id) - 1}`} passHref>
                    <Image
                        src='/static/images/arrow-purple.svg'
                        alt='Left arrow'
                        width={15}
                        height={15}
                        className='mb-1 cursor-pointer'
                    />
                </Link>

                <h1 className='text-white text-center text-xl md:text-3xl'>Epoch {Number(id)?.toLocaleString()}</h1>
                <Link href={`/epoch/${id && Number(id) + 1}`} passHref>
                    <Image
                        src='/static/images/arrow-purple.svg'
                        alt='Left arrow'
                        width={15}
                        height={15}
                        className='rotate-180 mb-1 cursor-pointer'
                    />
                </Link>
            </div>
            <div className='text-white'>{getDesktopView()}</div>
        </Layout>
    );
};

export default EpochComponent;

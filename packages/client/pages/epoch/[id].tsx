import { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

// Axios
import axiosClient from '../../config/axios';

// Components
import Layout from '../../components/layouts/Layout';
import ProgressSmoothBarEpoch from '../../components/ui/ProgressSmoothBarEpoch';
import EpochAnimation from '../../components/layouts/EpochAnimation';

// Constants
import { POOLS } from '../../constants';

// Types
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
            className='block uppercase border-2 px-5 rounded-2xl font-bold leading-4 py-0.5 sm:py-1'
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

    // Refs
    const slotRef = useRef(0);
    const containerRef = useRef<HTMLInputElement>(null);

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
            <div
                ref={containerRef}
                className='flex flex-col px-2 mt-10 overflow-x-scroll overflow-y-hidden scrollbar-thin'
                onMouseMove={handleMouseMove}
            >
                <div className='flex gap-x-4 justify-around px-4 xl:px-8 min-w-[700px] py-3 uppercase text-sm text-white text-center'>
                    <p className='mt-0.5 w-[10%]'>Block</p>
                    <p className='mt-0.5 w-[35%]'>Entity</p>
                    <p className='mt-0.5 w-[18%]'>Proposer</p>
                    <p className='mt-0.5 w-[18%]'>Slot</p>
                    <p className='mt-0.5 w-[18%]'>DateTime</p>
                </div>

                <Card className='flex flex-col gap-y-5 min-w-[700px] text-2xs sm:text-xs bg-[#FFF0A1] rounded-[22px] px-4 xl:px-8 py-3'>
                    {epoch?.f_slots?.map(element => (
                        <div
                            className='flex gap-x-4 py-3 uppercase text-center items-center'
                            key={element.f_proposer_slot}
                        >
                            <div className='flex items-center justify-center w-[10%]'>{getBlockImage(element)}</div>
                            <p className='w-[35%]'>{element.f_pool_name || 'others'}</p>
                            <p className='w-[18%]'>{element.f_val_idx.toLocaleString()}</p>
                            <div className='w-[18%]'>
                                <Link
                                    href={{
                                        pathname: '/slot/[id]',
                                        query: {
                                            id: element.f_proposer_slot,
                                        },
                                    }}
                                    passHref
                                    as={`/slot/${element.f_proposer_slot}`}
                                    className='flex gap-x-1 items-center w-fit mx-auto'
                                >
                                    <p>{element.f_proposer_slot.toLocaleString()}</p>
                                    <Image
                                        src='/static/images/link.svg'
                                        alt='Link icon'
                                        width={20}
                                        height={20}
                                        className='mb-1'
                                    />
                                </Link>
                            </div>
                            <p className='w-[18%]'>
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
            <div className='flex flex-col md:flex-row gap-x-10 gap-y-2 items-center md:justify-end md:w-full'>
                <div className='flex flex-row gap-x-3 justify-between w-full md:w-auto flex-grow max-w-[350px] min-w-[200px]'>
                    <p className='w-20' style={{ color: bg }}>
                        {title}
                    </p>
                    <div className='flex-grow'>
                        <ProgressSmoothBarEpoch bg={bg} color={color} percent={1 - value / attestations} />
                    </div>
                </div>
                <div className='flex flex-col md:flex-row gap-x-10 gap-y-2'>
                    <div className='md:w-[260px]'>
                        <CardContent content={`Missing ${title}: ${value.toLocaleString()}`} bg={bg} color={color} />
                    </div>
                    <div className='flex-shrink'>
                        <CardContent content={`Attestations: ${attestations.toLocaleString()}`} bg={bg} color={color} />
                    </div>
                </div>
            </div>
        );
    };

    const getContentEpochStats = () => {
        return (
            <Card className='flex flex-col gap-y-2 mx-2 px-6 uppercase overflow-x-scroll overflow-y-hidden scrollbar-thin text-black text-xl text-[8px] sm:text-[10px] bg-[#FFF0A1] rounded-[22px] py-3'>
                <div className='flex flex-row items-center gap-x-5'>
                    <p className='w-60'>DateTime (Local):</p>
                    <p className='leading-3'>{new Date(firstBlock + Number(epoch?.f_slot) * 12000).toLocaleString()}</p>
                </div>
                <div className='flex flex-col sm:flex-row gap-x-5'>
                    <p className='w-60'>Blocks (out of 32):</p>
                    <div className='flex justify-center gap-x-4 '>
                        <CardContent content={`Proposed: ${epoch?.proposed_blocks}`} bg='#00720B' color='#83E18C' />
                        <CardContent
                            content={`Missed: ${32 - Number(epoch?.proposed_blocks)}`}
                            bg='#980E0E'
                            color='#FF9090'
                        />
                    </div>
                </div>
                <div className='flex flex-col gap-y-4'>
                    <p className='items-start'>Attestation Accuracy:</p>

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
                    <div className='flex flex-col md:flex-row gap-x-10 gap-y-2 items-center md:justify-end md:w-full mb-4 mt-2'>
                        <div className='w-64 text-center'>
                            <ProgressSmoothBarEpoch
                                bg='#0016D8'
                                color='#BDC4FF'
                                percent={
                                    Number(epoch?.f_att_effective_balance_eth) /
                                    Number(epoch?.f_total_effective_balance_eth)
                                }
                            />
                        </div>
                        <div className='flex flex-col gap-y-2 w-64 md:w-fit'>
                            <CardContent
                                content={`Att. Balance: ${epoch?.f_att_effective_balance_eth?.toLocaleString()} ETH`}
                                bg='#0016D8'
                                color='#BDC4FF'
                            />
                        </div>
                        <div className='flex flex-col gap-y-2 w-64 md:w-fit'>
                            <CardContent
                                    content={`Act. Balance: ${epoch?.f_total_effective_balance_eth?.toLocaleString()} ETH`}
                                    bg='#0016D8'
                                    color='#BDC4FF'
                                />
                        </div>
                    </div>
                </div>
            </Card>
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

                <h1 className='text-white text-center text-xl md:text-3xl uppercase'>
                    Epoch {Number(id)?.toLocaleString()}
                </h1>
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

            {epoch && epoch.f_slots && epoch.f_slots.length > 0 ? (
                <div className='mx-auto max-w-[1100px]'>
                    <div>{getContentEpochStats()}</div>
                    <div>{getContentSlots()}</div>
                </div>
            ) : (
                <EpochAnimation />
            )}
        </Layout>
    );
};

export default EpochComponent;

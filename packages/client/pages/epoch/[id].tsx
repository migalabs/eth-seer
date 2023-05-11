import { useContext, useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import Link from 'next/link';
import { useRouter } from 'next/router';

// Axios
import axiosClient from '../../config/axios';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Components
import Layout from '../../components/layouts/Layout';
import ProgressSmoothBarEpoch from '../../components/ui/ProgressSmoothBarEpoch';
import EpochAnimation from '../../components/layouts/EpochAnimation';
import CustomImage from '../../components/ui/CustomImage';
import LinkIcon from '../../components/ui/LinkIcon';
import BlockImage from '../../components/ui/BlockImage';

// Types
import { Epoch } from '../../types';

// Constants
const firstBlock: number = Number(process.env.NEXT_PUBLIC_NETWORK_GENESIS); // 1606824023000

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
            className='block uppercase border-2 px-5 rounded-2xl font-bold leading-5 py-0.5 sm:py-1'
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

    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) || {};

    // Refs
    const epochRef = useRef(0);
    const existsEpochRef = useRef(true);
    const containerRef = useRef<HTMLInputElement>(null);

    const [epoch, setEpoch] = useState<Epoch | null>(null);
    const [animation, setAnimation] = useState(false);
    const [existsEpoch, setExistsEpoch] = useState<boolean>(true);
    const [notEpoch, setNotEpoch] = useState<boolean>(false);
    const [desktopView, setDesktopView] = useState(true);

    // UseEffect
    useEffect(() => {
        if (id) {
            epochRef.current = Number(id);
        }

        if ((id && !epoch) || (epoch && epoch.f_epoch !== Number(id))) {
            getEpoch();
        }

        setDesktopView(window !== undefined && window.innerWidth > 768);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const getEpoch = async () => {
        try {
            const response = await axiosClient.get(`/api/validator-rewards-summary/epoch/${id}`);

            setEpoch({
                ...response.data.epoch,
            });

            if (Number(response.data.epoch.proposed_blocks) == 0 && response.data.epoch.f_slots.length == 0) {
                setAnimation(true);

                const expectedTimestamp = (firstBlock + Number(id) * 12000 * 32 + 12000 * 64) / 1000;

                setExistsEpoch(false);

                existsEpochRef.current = false;

                const timeDifference = new Date(expectedTimestamp * 1000).getTime() - new Date().getTime();

                if (timeDifference > 0) {
                    setTimeout(() => {
                        if (Number(id) === epochRef.current) {
                            getEpoch();
                        }
                    }, timeDifference + 2000);
                } else if (timeDifference > -30000) {
                    setTimeout(() => {
                        if (Number(id) === epochRef.current) {
                            getEpoch();
                        }
                    }, 1000);
                } else if (timeDifference < -30000) {
                    setNotEpoch(true);
                }
            } else {
                setExistsEpoch(true);
                setAnimation(false);
                existsEpochRef.current = true;
            }
        } catch (error) {
            console.log(error);
            setAnimation(true);
        }
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

                <Card
                    className='flex flex-col gap-y-2 min-w-[700px] text-2xs sm:text-xs rounded-[22px] px-4 xl:px-8 py-3'
                    style={{
                        backgroundColor: themeMode?.darkMode ? 'var(--yellow2)' : 'var(--blue1)',
                        boxShadow: themeMode?.darkMode ? 'var(--boxShadowYellow1)' : 'var(--boxShadowBlue1)',
                    }}
                >
                    {epoch?.f_slots?.map(element => (
                        <div
                            className='flex gap-x-4 py-1 uppercase text-center items-center'
                            key={element.f_proposer_slot}
                        >
                            <div className='flex items-center justify-center w-[10%]'>
                                <BlockImage slot={element} />
                            </div>
                            <div className='w-[35%]'>
                                <Link
                                    href={{
                                        pathname: '/entity/[name]',
                                        query: {
                                            name: element.f_pool_name || 'others',
                                        },
                                    }}
                                    passHref
                                    as={`/entity/${element.f_pool_name || 'others'}`}
                                    className='flex gap-x-1 items-center w-fit mx-auto'
                                >
                                    <p>{element.f_pool_name || 'others'}</p>
                                    <LinkIcon />
                                </Link>
                            </div>
                            <div className='w-[18%]'>
                                <Link
                                    href={{
                                        pathname: '/validator/[id]',
                                        query: {
                                            id: element.f_val_idx,
                                        },
                                    }}
                                    passHref
                                    as={`/validator/${element.f_val_idx}`}
                                    className='flex gap-x-1 items-center w-fit mx-auto'
                                >
                                    <p>{element.f_val_idx.toLocaleString()}</p>
                                    <LinkIcon />
                                </Link>
                            </div>
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
                                    <LinkIcon />
                                </Link>
                            </div>
                            <p className='w-[18%]'>
                                {new Date(firstBlock + Number(element.f_proposer_slot) * 12000).toLocaleString('ja-JP')}
                            </p>
                        </div>
                    ))}
                </Card>
            </div>
        );
    };

    const getContentSlotsMobile = () => {
        return (
            <Card
                className='mt-5 flex flex-col gap-y-2 mx-2 px-6 uppercase overflow-x-scroll overflow-y-hidden scrollbar-thin text-black text-xl text-[8px] sm:text-[10px]  rounded-[22px] py-3'
                style={{
                    backgroundColor: themeMode?.darkMode ? 'var(--yellow2)' : 'var(--blue1)',
                    boxShadow: themeMode?.darkMode ? 'var(--boxShadowYellow1)' : 'var(--boxShadowBlue1)',
                }}
            >
                {epoch?.f_slots?.map(element => (
                    <div className='flex flex-row gap-x-6 py-1 uppercase' key={element.f_proposer_slot}>
                        <div className='flex items-center'>
                            <BlockImage slot={element} />
                        </div>
                        <div className='flex flex-col items-start '>
                            <div>
                                <Link
                                    href={{
                                        pathname: '/validator/[id]',
                                        query: {
                                            id: element.f_val_idx,
                                        },
                                    }}
                                    passHref
                                    as={`/validator/${element.f_val_idx}`}
                                    className='flex gap-x-1 items-center w-fit mx-auto'
                                >
                                    <div className='flex flex-row items-center gap-x-8'>
                                        <p className='w-20'>Proposer:</p>
                                        <p className='leading-3'>{element.f_val_idx.toLocaleString()}</p>
                                    </div>
                                    <LinkIcon />
                                </Link>
                            </div>
                            <div>
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
                                    <div className='flex flex-row items-center gap-x-8'>
                                        <p className='w-20'>Slot:</p>
                                        <p className='leading-3'>{element.f_proposer_slot.toLocaleString()}</p>
                                    </div>
                                    <LinkIcon />
                                </Link>
                            </div>
                            <div className='flex flex-row items-center gap-x-10'>
                                <p className='w-20'>DateTime:</p>
                                <p className='leading-3'>
                                    {new Date(firstBlock + Number(epoch?.f_slot) * 12000).toLocaleString('ja-JP')}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </Card>
        );
    };

    const getAttestation = (title: string, bg: string, color: string, value: number, attestations: number) => {
        return (
            <div className='flex flex-col md:flex-row gap-x-10 gap-y-2 items-center md:justify-end md:w-full'>
                <div className='flex flex-col md:flex-row gap-x-3 justify-between w-full md:w-auto flex-grow max-w-[350px] min-w-[200px]'>
                    <p className='w-20' style={{ color: bg }}>
                        {title}
                    </p>
                    <div className='flex-grow mx-6 md:mx-0'>
                        <ProgressSmoothBarEpoch bg={bg} color={color} percent={1 - value / attestations} />
                    </div>
                </div>
                <div className='flex flex-col md:flex-row gap-x-10 gap-y-2'>
                    <div className='md:w-[275px]'>
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
            <Card
                className='flex flex-col gap-y-2 mx-2 px-6 uppercase overflow-x-scroll overflow-y-hidden scrollbar-thin text-black text-xl text-[8px] sm:text-[10px]  rounded-[22px] py-3'
                style={{
                    backgroundColor: themeMode?.darkMode ? 'var(--yellow2)' : 'var(--blue1)',
                    boxShadow: themeMode?.darkMode ? 'var(--boxShadowYellow1)' : 'var(--boxShadowBlue1)',
                }}
            >
                <div className='flex flex-row items-center gap-x-5'>
                    <p className='w-60'>DateTime (Local):</p>
                    <p className='leading-3'>
                        {new Date(firstBlock + Number(epoch?.f_slot) * 12000).toLocaleString('ja-JP')}
                    </p>
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
                <div className='flex flex-col gap-y-2'>
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
                        <div className='flex flex-col gap-y-2 w-[270px] md:w-fit'>
                            <CardContent
                                content={`Att. Balance: ${epoch?.f_att_effective_balance_eth?.toLocaleString()} ETH`}
                                bg='#0016D8'
                                color='#BDC4FF'
                            />
                        </div>
                        <div className='flex flex-col gap-y-2 w-[270px] md:w-fit'>
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
                    <CustomImage
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
                    <CustomImage
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
                    <div>{desktopView ? getContentSlots() : getContentSlotsMobile()}</div>
                </div>
            ) : (
                animation && <EpochAnimation darkMode={themeMode?.darkMode as boolean} notEpoch={notEpoch} />
            )}
        </Layout>
    );
};

export default EpochComponent;

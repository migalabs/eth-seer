import { useContext, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

// Axios
import axiosClient from '../../config/axios';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Components
import Layout from '../../components/layouts/Layout';
import ProgressSmoothBarEpoch from '../../components/ui/ProgressSmoothBarEpoch';
import ProgressSmoothBar from '../../components/ui/ProgressSmoothBar';
import EpochAnimation from '../../components/layouts/EpochAnimation';
import CustomImage from '../../components/ui/CustomImage';
import LinkIcon from '../../components/ui/LinkIcon';
import BlockImage from '../../components/ui/BlockImage';
import Loader from '../../components/ui/Loader';
import LinkValidator from '../../components/ui/LinkValidator';
import LinkSlot from '../../components/ui/LinkSlot';

// Types
import { Epoch, Slot } from '../../types';

// Constants
const firstBlock: number = Number(process.env.NEXT_PUBLIC_NETWORK_GENESIS); // 1606824023000

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
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    // Refs
    const epochRef = useRef(0);
    const existsEpochRef = useRef(true);
    const containerRef = useRef<HTMLInputElement>(null);

    // States
    const [epoch, setEpoch] = useState<Epoch | null>(null);
    const [slots, setSlots] = useState<Slot[]>([]);
    const [animation, setAnimation] = useState(false);
    const [notEpoch, setNotEpoch] = useState<boolean>(false);
    const [desktopView, setDesktopView] = useState(true);
    const [loadingEpoch, setLoadingEpoch] = useState(true);
    const [loadingSlots, setLoadingSlots] = useState(true);

    // UseEffect
    useEffect(() => {
        if (id) {
            epochRef.current = Number(id);
        }

        if ((id && !epoch) || (epoch && epoch.f_epoch !== Number(id))) {
            getEpoch();
            getSlots();
        }

        setDesktopView(window !== undefined && window.innerWidth > 768);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const getEpoch = async () => {
        try {
            setLoadingEpoch(true);

            const response = await axiosClient.get(`/api/epochs/${id}`);

            setEpoch({
                ...response.data.epoch,
            });

            if (Number(response.data.epoch.proposed_blocks) === 0) {
                setAnimation(true);

                const expectedTimestamp = (firstBlock + Number(id) * 12000 * 32 + 12000 * 64) / 1000;

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
                setAnimation(false);
                existsEpochRef.current = true;
            }
        } catch (error) {
            console.log(error);
            setAnimation(true);
        } finally {
            setLoadingEpoch(false);
        }
    };

    const getSlots = async () => {
        try {
            setLoadingSlots(true);

            const response = await axiosClient.get(`/api/epochs/${id}/slots`);

            setSlots(response.data.slots);
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingSlots(false);
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
                <div className='flex gap-x-4 justify-around px-4 xl:px-8 min-w-[1050px] py-3 uppercase text-sm text-white text-center'>
                    <p className='mt-0.5 w-[7%]'>Block</p>
                    <p className='mt-0.5 w-[32%]'>Entity</p>
                    <p className='mt-0.5 w-[14%]'>Proposer</p>
                    <p className='mt-0.5 w-[15%]'>Slot</p>
                    <p className='mt-0.5 w-[14%]'>DateTime</p>
                    <p className='mt-0.5 w-[18%]'>Withdrawals</p>
                </div>

                <div
                    className='flex flex-col gap-y-2 min-w-[1050px] text-2xs sm:text-xs rounded-[22px] px-4 xl:px-8 py-3'
                    style={{
                        backgroundColor: themeMode?.darkMode ? 'var(--yellow2)' : 'var(--blue1)',
                        boxShadow: themeMode?.darkMode ? 'var(--boxShadowYellow1)' : 'var(--boxShadowBlue1)',
                    }}
                >
                    {slots.map(element => (
                        <div
                            className='flex gap-x-4 py-1 uppercase text-center items-center'
                            key={element.f_proposer_slot}
                        >
                            <div className='flex items-center justify-center w-[7%]'>
                                <BlockImage
                                    poolName={element.f_pool_name}
                                    proposed={element.f_proposed}
                                    width={60}
                                    height={60}
                                    showCheck
                                />
                            </div>
                            <div className='w-[32%]'>
                                <Link
                                    href={{
                                        pathname: '/entities/[name]',
                                        query: {
                                            name: element.f_pool_name || 'others',
                                        },
                                    }}
                                    passHref
                                    as={`/entities/${element.f_pool_name || 'others'}`}
                                    className='flex gap-x-1 items-center w-fit mx-auto'
                                >
                                    <p>{element.f_pool_name || 'others'}</p>
                                    <LinkIcon />
                                </Link>
                            </div>
                            <div className='w-[14%]'>
                                <LinkValidator validator={element.f_val_idx} />
                            </div>
                            <div className='w-[15%]'>
                                <LinkSlot slot={element.f_proposer_slot} />
                            </div>
                            <p className='w-[14%]'>
                                {new Date(firstBlock + Number(element.f_proposer_slot) * 12000).toLocaleString('ja-JP')}
                            </p>
                            <p className='w-[18%]'>{(element.withdrawals / 10 ** 9).toLocaleString()} ETH</p>
                        </div>
                    ))}

                    {slots.length === 0 && (
                        <div className='flex justify-center p-2'>
                            <p className='uppercase'>No slots</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const getContentSlotsMobile = () => {
        return (
            <div
                className='mt-5 flex flex-col gap-y-2 mx-2 px-6 uppercase overflow-x-scroll overflow-y-hidden scrollbar-thin text-black text-xl text-[8px] sm:text-[10px]  rounded-[22px] py-3'
                style={{
                    backgroundColor: themeMode?.darkMode ? 'var(--yellow2)' : 'var(--blue1)',
                    boxShadow: themeMode?.darkMode ? 'var(--boxShadowYellow1)' : 'var(--boxShadowBlue1)',
                }}
            >
                {slots.map(element => (
                    <div className='flex flex-row gap-x-6 py-1 uppercase' key={element.f_proposer_slot}>
                        <div className='flex items-center'>
                            <BlockImage
                                poolName={element.f_pool_name}
                                proposed={element.f_proposed}
                                width={60}
                                height={60}
                                showCheck
                            />
                        </div>
                        <div className='flex flex-col items-start '>
                            <div className='flex flex-row items-center gap-x-8'>
                                <p className='w-24'>Validator:</p>
                                <LinkValidator validator={element.f_val_idx} />
                            </div>

                            <div className='flex flex-row items-center gap-x-8'>
                                <p className='w-24'>Slot:</p>
                                <LinkSlot slot={element.f_proposer_slot} />
                            </div>

                            <div className='flex flex-row items-center gap-x-8'>
                                <p className='w-24'>DateTime:</p>
                                <div className='flex flex-col gap-y-0.5'>
                                    <p className='leading-3'>
                                        {new Date(firstBlock + Number(epoch?.f_slot) * 12000).toLocaleDateString(
                                            'ja-JP',
                                            { year: 'numeric', month: 'numeric', day: 'numeric' }
                                        )}
                                    </p>
                                    <p className='leading-3'>
                                        {new Date(firstBlock + Number(epoch?.f_slot) * 12000).toLocaleTimeString(
                                            'ja-JP',
                                            { hour: 'numeric', minute: 'numeric', second: 'numeric' }
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className='flex flex-row items-center gap-x-8'>
                                <p className='w-24'>Withdrawals:</p>
                                <p className='leading-3'>{(element.withdrawals / 10 ** 9).toLocaleString()} ETH</p>
                            </div>
                        </div>
                    </div>
                ))}

                {slots.length === 0 && (
                    <div className='flex justify-center p-2'>
                        <p className='uppercase'>No slots</p>
                    </div>
                )}
            </div>
        );
    };

    const getAttestation = (
        title: string,
        primaryColor: string,
        secundaryColor: string,
        value: number,
        attestations: number
    ) => {
        return (
            <div className='flex flex-col md:flex-row gap-x-10 gap-y-2 items-center md:justify-end md:w-full'>
                <div className='flex flex-col md:flex-row gap-x-3 justify-between w-full md:w-auto flex-grow max-w-[350px] min-w-[200px]'>
                    <p className='w-20' style={{ color: primaryColor }}>
                        {title}
                    </p>
                    <div className='flex-grow mx-6 md:mx-0'>
                        <ProgressSmoothBarEpoch
                            backgroundColor={secundaryColor}
                            color={primaryColor}
                            percent={1 - value / attestations}
                        />
                    </div>
                </div>

                <div className='flex flex-col md:flex-row gap-x-10 gap-y-2'>
                    <div className='md:w-[275px]'>
                        <CardContent
                            content={`Missing ${title}: ${value.toLocaleString()}`}
                            bg={primaryColor}
                            color={secundaryColor}
                        />
                    </div>
                    <div className='flex-shrink'>
                        <CardContent
                            content={`Attestations: ${attestations.toLocaleString()}`}
                            bg={primaryColor}
                            color={secundaryColor}
                        />
                    </div>
                </div>
            </div>
        );
    };

    const getContentEpochStats = () => {
        return (
            <div
                className='flex flex-col gap-y-2 mx-2 px-6 uppercase overflow-x-scroll overflow-y-hidden scrollbar-thin text-black text-xl text-[8px] sm:text-[10px]  rounded-[22px] py-3'
                style={{
                    backgroundColor: themeMode?.darkMode ? 'var(--yellow2)' : 'var(--blue1)',
                    boxShadow: themeMode?.darkMode ? 'var(--boxShadowYellow1)' : 'var(--boxShadowBlue1)',
                }}
            >
                <div className='flex flex-row items-center gap-x-5'>
                    <p className='w-40 sm:w-60'>DateTime (Local):</p>
                    <p className='leading-3'>
                        {new Date(firstBlock + Number(epoch?.f_slot) * 12000).toLocaleString('ja-JP')}
                    </p>
                </div>
                <div className='flex flex-col sm:flex-row gap-x-5'>
                    <p className='w-40 sm:w-60'>Blocks (out of 32):</p>
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
                        <div>
                            <ProgressSmoothBar
                                percent={
                                    Number(epoch?.f_att_effective_balance_eth) /
                                    Number(epoch?.f_total_effective_balance_eth)
                                }
                                color='#0016D8'
                                backgroundColor='#BDC4FF'
                                width={170}
                                widthTooltip={220}
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
                    <div className='flex flex-row items-center gap-x-5'>
                        <p className='w-40 sm:w-60'>Withdrawals:</p>
                        <p className='leading-3'>{((epoch?.withdrawals ?? 0) / 10 ** 9).toLocaleString()} ETH</p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Layout isMain={false}>
            <div className='flex gap-x-3 justify-center items-center mt-2 mb-5'>
                <Link href={`/epochs/${id && Number(id) - 1}`} passHref>
                    <CustomImage
                        src={themeMode?.darkMode ? '/static/images/arrow.svg' : '/static/images/arrow-blue.svg'}
                        alt='Left arrow'
                        width={15}
                        height={15}
                        className='mb-1 cursor-pointer'
                    />
                </Link>

                <h1 className='text-white text-center text-xl md:text-3xl uppercase'>
                    Epoch {Number(id)?.toLocaleString()}
                </h1>

                <Link href={`/epochs/${id && Number(id) + 1}`} passHref>
                    <CustomImage
                        src={themeMode?.darkMode ? '/static/images/arrow.svg' : '/static/images/arrow-blue.svg'}
                        alt='Right arrow'
                        width={15}
                        height={15}
                        className='rotate-180 mb-1 cursor-pointer'
                    />
                </Link>
            </div>

            {loadingEpoch && (
                <div className='mt-6'>
                    <Loader />
                </div>
            )}

            {!loadingEpoch && epoch && existsEpochRef.current && (
                <div className='mx-auto max-w-[1100px]'>
                    <div>{getContentEpochStats()}</div>

                    {loadingSlots ? (
                        <div className='mt-6'>
                            <Loader />
                        </div>
                    ) : (
                        <div>{desktopView ? getContentSlots() : getContentSlotsMobile()}</div>
                    )}
                </div>
            )}

            {!loadingEpoch && animation && <EpochAnimation notEpoch={notEpoch} />}
        </Layout>
    );
};

export default EpochComponent;

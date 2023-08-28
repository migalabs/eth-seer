import { useContext, useEffect, useRef, useState } from 'react';
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
import Loader from '../../components/ui/Loader';
import LinkEpoch from '../../components/ui/LinkEpoch';
import Slots from '../../components/layouts/Slots';
import Arrow from '../../components/ui/Arrow';

// Types
import { Epoch, Slot } from '../../types';

// Constants
import { FIRST_BLOCK } from '../../constants';

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

    // States
    const [epoch, setEpoch] = useState<Epoch | null>(null);
    const [slots, setSlots] = useState<Slot[]>([]);
    const [animation, setAnimation] = useState(false);
    const [notEpoch, setNotEpoch] = useState<boolean>(false);
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

                const expectedTimestamp = (FIRST_BLOCK + Number(id) * 12000 * 32 + 12000 * 64) / 1000;

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
                className='flex flex-col gap-y-2 mx-2 px-6 uppercase overflow-x-scroll overflow-y-hidden scrollbar-thin text-black leading-7 text-[8px] sm:text-[10px] rounded-[22px] py-3'
                style={{
                    backgroundColor: themeMode?.darkMode ? 'var(--yellow2)' : 'var(--blue1)',
                    boxShadow: themeMode?.darkMode ? 'var(--boxShadowYellow1)' : 'var(--boxShadowBlue1)',
                }}
            >
                <div className='flex flex-row items-center gap-x-5'>
                    <p className='w-40 sm:w-60'>DateTime (Local):</p>
                    <p className='leading-3'>
                        {new Date(FIRST_BLOCK + Number(epoch?.f_slot) * 12000).toLocaleString('ja-JP')}
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
        <Layout>
            <div className='flex gap-x-3 justify-center items-center mt-2 mb-5'>
                <LinkEpoch epoch={Number(id) - 1}>
                    <Arrow direction='left' />
                </LinkEpoch>

                <h1 className='text-white text-center text-xl md:text-3xl uppercase'>
                    Epoch {Number(id)?.toLocaleString()}
                </h1>

                <LinkEpoch epoch={Number(id) + 1}>
                    <Arrow direction='right' />
                </LinkEpoch>
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
                        <Slots slots={slots} />
                    )}
                </div>
            )}

            {!loadingEpoch && animation && <EpochAnimation notEpoch={notEpoch} />}
        </Layout>
    );
};

export default EpochComponent;

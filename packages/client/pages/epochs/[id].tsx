import { useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

// Axios
import axiosClient from '../../config/axios';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Components
import Layout from '../../components/layouts/Layout';
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
    boxShadow: string;
};

const CardContent = ({ content, bg, color, boxShadow }: Props) => {
    return (
        <span
            className='block w-40 text-center capitalize rounded-md font-medium p-2'
            style={{ background: color, borderColor: bg, color: bg, boxShadow: boxShadow }}
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

    const getContentEpochStats = () => {
        return (
            <div
                className='flex flex-col gap-y-4 p-6 md:px-20 md:py-10 md:text-[16px] text-[12px] font-medium rounded-md border-2 border-white'
                style={{
                    backgroundColor: themeMode?.darkMode ? 'var(--bgFairDarkMode)' : 'var(--bgMainLightMode)',
                    boxShadow: themeMode?.darkMode ? 'var(--boxShadowCardDark)' : 'var(--boxShadowCardLight)',
                    color: themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)',
                }}
            >
                <div className='flex flex-row items-center gap-x-5'>
                    <p className='w-40 sm:w-60'>DateTime (Local):</p>
                    <p className={`text-${themeMode?.darkMode ? 'white' : 'black'}`}>
                        {new Date(FIRST_BLOCK + Number(epoch?.f_slot) * 12000).toLocaleString('ja-JP')}
                    </p>
                </div>
                <div className='flex flex-col sm:flex-row gap-x-5'>
                    <p className='w-40 sm:w-60'>Blocks (out of 32):</p>
                    <div className='flex justify-center gap-x-4 pt-3 md:pt-0'>
                        <CardContent
                            content={`Proposed: ${epoch?.proposed_blocks}`}
                            bg='var(--white)'
                            color='var(--proposedGreen)'
                            boxShadow='var(--boxShadowRed)'
                        />
                        <CardContent
                            content={`Missed: ${32 - Number(epoch?.proposed_blocks)}`}
                            bg='var(--white)'
                            color='var(--missedRed)'
                            boxShadow='var(--boxShadowRed)'
                        />
                    </div>
                </div>
                <div className='flex flex-col'>
                    <p className=''>Attestation Accuracy:</p>
                    {epoch && (
                        <div
                            className={`flex flex-col xl:flex-row items-center gap-2 md:gap-4 text-[12px] md:text-[14px] font-normal text-${
                                themeMode?.darkMode ? 'white' : 'black'
                            }`}
                        >
                            <ProgressSmoothBar
                                title='Target'
                                color='#343434'
                                backgroundColor='#f5f5f5'
                                percent={1 - epoch.f_missing_target / epoch.f_num_att_vals}
                                width={300}
                                tooltipColor='orange'
                                tooltipContent={
                                    <>
                                        <span>Missing Target: {epoch.f_missing_target?.toLocaleString()}</span>
                                        <span>Attestations: {epoch.f_num_att_vals?.toLocaleString()}</span>
                                    </>
                                }
                                widthTooltip={220}
                            />

                            <ProgressSmoothBar
                                title='Source'
                                color='#343434'
                                backgroundColor='#f5f5f5'
                                percent={1 - epoch.f_missing_source / epoch.f_num_att_vals}
                                width={300}
                                tooltipColor='blue'
                                tooltipContent={
                                    <>
                                        <span>Missing Source: {epoch.f_missing_source?.toLocaleString()}</span>
                                        <span>Attestations: {epoch.f_num_att_vals?.toLocaleString()}</span>
                                    </>
                                }
                                widthTooltip={220}
                            />

                            <ProgressSmoothBar
                                title='Head'
                                color='#343434'
                                backgroundColor='#f5f5f5'
                                percent={1 - epoch.f_missing_head / epoch.f_num_att_vals}
                                width={300}
                                tooltipColor='purple'
                                tooltipContent={
                                    <>
                                        <span>Missing Head: {epoch.f_missing_head?.toLocaleString()}</span>
                                        <span>Attestations: {epoch.f_num_att_vals?.toLocaleString()}</span>
                                    </>
                                }
                                widthTooltip={220}
                            />
                        </div>
                    )}
                </div>
                <div className='flex flex-col'>
                    <p className={`text-${themeMode?.darkMode ? 'white' : 'darkGray'}`}>Voting Participation:</p>
                    <div className='pt-3 py-1 mx-auto md:mx-0'>
                        {epoch && (
                            <ProgressSmoothBar
                                title=''
                                color='#343434'
                                backgroundColor='#f5f5f5'
                                width={300}
                                percent={epoch.f_att_effective_balance_eth / epoch.f_total_effective_balance_eth || 0}
                                tooltipColor='blue'
                                tooltipContent={
                                    <>
                                        <span>Agg. Rewards: {epoch?.f_att_effective_balance_eth}</span>
                                        <span>Max. Rewards: {epoch?.f_total_effective_balance_eth}</span>
                                    </>
                                }
                                widthTooltip={220}
                            />
                        )}
                    </div>
                </div>
                <div className='flex flex-row items-center gap-x-5'>
                    <p className='w-40 sm:w-60'>Withdrawals:</p>
                    <p className={`text-${themeMode?.darkMode ? 'white' : 'black'}`}>
                        {((epoch?.withdrawals ?? 0) / 10 ** 9).toLocaleString()} ETH
                    </p>
                </div>
            </div>
        );
    };

    return (
        <Layout>
            <Head>
                <meta name='robots' property='noindex' />
            </Head>

            <div className='flex gap-x-5 md:gap-x-10 justify-center items-center mb-5 mt-14 xl:mt-0'>
                <LinkEpoch epoch={Number(id) - 1}>
                    <Arrow direction='left' />
                </LinkEpoch>

                <h1 className='text-black text-center font-medium md:text-[40px] text-[30px]'>
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
                <div className='mx-auto w-11/12 md:w-10/12'>
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

            {!loadingEpoch &&  animation && <EpochAnimation notEpoch={notEpoch} />}
        </Layout>
    );
};

export default EpochComponent;

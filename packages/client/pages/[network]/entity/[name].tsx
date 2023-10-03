import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// Axios
import axiosClient from '../../../config/axios';

// Contexts
import ThemeModeContext from '../../../contexts/theme-mode/ThemeModeContext';

// Components
import Layout from '../../../components/layouts/Layout';
import BlockGif from '../../../components/ui/BlockGif';
import Animation from '../../../components/layouts/Animation';
import Loader from '../../../components/ui/Loader';
import ProgressSmoothBar from '../../../components/ui/ProgressSmoothBar';
import TabHeader from '../../../components/ui/TabHeader';

// Types
import { Entity } from '../../../types';

type Props = {
    content: string;
    bg: string;
    color: string;
    boxShadow: string;
};

const CardContent = ({ content, bg, color, boxShadow }: Props) => {
    return (
        <span
            className='block px-5 rounded-md font-medium capitalize py-2 text-center w-52'
            style={{ background: bg, color: color, boxShadow: boxShadow }}
        >
            {content}
        </span>
    );
};

const EntityComponent = () => {
    // Next router
    const router = useRouter();
    const { network, name } = router.query;

    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    // States
    const [entityHour, setEntityHour] = useState<Entity | null>(null);
    const [entityDay, setEntityDay] = useState<Entity | null>(null);
    const [entityWeek, setEntityWeek] = useState<Entity | null>(null);
    const [showAnimation, setShowAnimation] = useState<boolean>(false);
    const [tabPageIndexEntityPerformance, setTabPageIndexEntityPerformance] = useState(0);
    const [loading, setLoading] = useState<boolean>(true);

    // UseEffect
    useEffect(() => {
        if (name && !entityHour && !entityDay && !entityWeek) {
            getEntity();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name]);

    const getEntity = async () => {
        try {
            setLoading(true);

            const hour = 9;
            const day = 225;
            const week = 1575;

            const [responseHour, responseDay, responseWeek] = await Promise.all([
                axiosClient.get(`/api/entities/${(name as string).toLowerCase()}`, {
                    params: {
                        network,
                        numberEpochs: hour,
                    },
                }),
                axiosClient.get(`/api/entities/${(name as string).toLowerCase()}`, {
                    params: {
                        network,
                        numberEpochs: day,
                    },
                }),
                axiosClient.get(`/api/entities/${(name as string).toLowerCase()}`, {
                    params: {
                        network,
                        numberEpochs: week,
                    },
                }),
            ]);

            setEntityHour(responseHour.data.entity);
            setEntityDay(responseDay.data.entity);
            setEntityWeek(responseWeek.data.entity);

            // const response = await axiosClient.get(`/api/entities/${(name as string).toLowerCase()}`);

            if (responseHour.data.entity) {
                setShowAnimation(false);
            } else {
                setShowAnimation(true);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    // Container Entity Performance
    const getEntityPerformance = (entity: Entity) => {
        return (
            <>
                {/* Rewards */}
                <div className='flex flex-col md:flex-row py-4 gap-y-2 md:gap-y-0 md:mb-0'>
                    <p className={`md:w-52 lg:w-80 text-${themeMode?.darkMode ? 'white' : 'black'}`}>Rewards:</p>
                    <div className='w-72 md:w-80 text-center font-normal'>
                        {entity && (
                            <ProgressSmoothBar
                                title=''
                                color='var(--black)'
                                backgroundColor='var(--white)'
                                percent={entity.aggregated_rewards / entity.aggregated_max_rewards || 0}
                                tooltipColor='blue'
                                tooltipContent={
                                    <>
                                        <span>Agg. Rewards: {entity?.aggregated_rewards}</span>
                                        <span>Max. Rewards: {entity?.aggregated_max_rewards}</span>
                                    </>
                                }
                                widthTooltip={220}
                            />
                        )}
                    </div>
                </div>

                <div className='flex flex-col md:flex-row py-4 gap-y-2 md:gap-y-0 md:mb-0'>
                    <p className={`md:w-52 lg:w-80 text-${themeMode?.darkMode ? 'white' : 'black'}`}>
                        Sync committee participation:
                    </p>
                    <p className={`font-semibold text-${themeMode?.darkMode ? 'white' : 'black'}`}>
                        {entity?.count_sync_committee} duties
                    </p>
                </div>

                {/* Attestation flags */}
                <div className='flex flex-col lg:flex-row py-4 gap-y-2 md:gap-y-0 md:mb-0'>
                    <p className={`md:w-52 lg:w-80 text-${themeMode?.darkMode ? 'white' : 'black'}`}>
                        Attestation flags:
                    </p>

                    {entity && (
                        <div
                            className='flex flex-col xl:flex-row items-center gap-x-4 gap-y-2 font-normal text-[12px]'
                            style={{
                                color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                            }}
                        >
                            <ProgressSmoothBar
                                title='Target'
                                color='var(--black)'
                                backgroundColor='var(--white)'
                                percent={1 - entity.count_missing_target / entity.count_expected_attestations}
                                width={250}
                                tooltipColor='orange'
                                tooltipContent={
                                    <>
                                        <span>Missing Target: {entity.count_missing_target?.toLocaleString()}</span>
                                        <span>
                                            Attestations: {entity.count_expected_attestations?.toLocaleString()}
                                        </span>
                                    </>
                                }
                                widthTooltip={220}
                            />

                            <ProgressSmoothBar
                                title='Source'
                                color='var(--black)'
                                backgroundColor='var(--white)'
                                percent={1 - entity.count_missing_source / entity.count_expected_attestations}
                                width={250}
                                tooltipColor='blue'
                                tooltipContent={
                                    <>
                                        <span>Missing Source: {entity.count_missing_source?.toLocaleString()}</span>
                                        <span>
                                            Attestations: {entity.count_expected_attestations?.toLocaleString()}
                                        </span>
                                    </>
                                }
                                widthTooltip={220}
                            />

                            <ProgressSmoothBar
                                title='Head'
                                color='var(--black)'
                                backgroundColor='var(--white)'
                                percent={1 - entity.count_missing_head / entity.count_expected_attestations}
                                width={250}
                                tooltipColor='purple'
                                tooltipContent={
                                    <>
                                        <span>Missing Head: {entity.count_missing_head?.toLocaleString()}</span>
                                        <span>
                                            Attestations: {entity.count_expected_attestations?.toLocaleString()}
                                        </span>
                                    </>
                                }
                                widthTooltip={220}
                            />
                        </div>
                    )}
                </div>

                {/* Blocks Entity Performance */}
                <div className='flex flex-col md:flex-row py-4 gap-y-2 md:gap-y-0 md:mb-0'>
                    <p className={`md:w-52 lg:w-80 text-${themeMode?.darkMode ? 'white' : 'black'}`}>Blocks:</p>

                    <div className='flex justify-center'>
                        <div className='flex flex-col md:flex-row gap-x-4 gap-y-2'>
                            <CardContent
                                content={`Proposed: ${entity.proposed_blocks_performance}`}
                                bg='var(--proposedGreen)'
                                color='var(--white)'
                                boxShadow='var(--boxShadowGreen)'
                            />

                            <CardContent
                                content={`Missed: ${entity.missed_blocks_performance}`}
                                bg='var(--missedRed)'
                                color='var(--white)'
                                boxShadow='var(--boxShadowRed)'
                            />
                        </div>
                    </div>
                </div>
            </>
        );
    };

    return (
        <Layout>
            <div className='flex gap-x-3 justify-center items-center mt-14 xl:mt-0 mb-5'>
                <h1 className='text-black uppercase text-center font-medium md:text-[40px] text-[30px]'>{name}</h1>
            </div>

            {loading && (
                <div className='mt-6'>
                    <Loader />
                </div>
            )}

            {entityDay && (
                <div className='mx-auto w-11/12 md:w-10/12'>
                    <div
                        className='flex p-8 rounded-md   gap-x-5 border-2 border-white'
                        style={{
                            backgroundColor: themeMode?.darkMode ? 'var(--bgFairDarkMode)' : 'var(--bgMainLightMode)',
                            boxShadow: themeMode?.darkMode ? 'var(--boxShadowCardDark)' : 'var(--boxShadowCardLight)',
                            color: themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)',
                        }}
                    >
                        <div
                            className='flex flex-col gap-y-8 text-xs md:text-[14px] mx-auto'
                            style={{
                                color: themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)',
                            }}
                        >
                            <div className='flex flex-row items-center gap-x-5'>
                                <p
                                    className={`w-60 font-semibold mb-2 text-${
                                        themeMode?.darkMode ? 'white' : 'black'
                                    }`}
                                >
                                    Aggregate Balance:
                                </p>
                                <p className={`font-semibold text-${themeMode?.darkMode ? 'white' : 'black'}`}>
                                    {entityDay && entityDay.aggregate_balance?.toLocaleString()} ETH
                                </p>
                            </div>
                            {/* Blocks */}
                            <div className='flex flex-col lg:flex-row gap-x-5 gap-y-1'>
                                <p
                                    className={`w-44 sm:w-60 font-semibold text-${
                                        themeMode?.darkMode ? 'white' : 'black'
                                    }`}
                                >
                                    Blocks:
                                </p>
                                <div className='flex flex-col lg:flex-row items-end gap-x-4 gap-y-2'>
                                    <CardContent
                                        content={`Proposed: ${
                                            entityDay && entityDay.proposed_blocks.f_proposed?.toLocaleString()
                                        }`}
                                        bg='var(--proposedGreen)'
                                        color='var(--white)'
                                        boxShadow='var(--boxShadowGreen)'
                                    />
                                    <CardContent
                                        content={`Missed: ${
                                            entityDay && entityDay.proposed_blocks.f_missed?.toLocaleString()
                                        }`}
                                        bg='var(--missedRed)'
                                        color='var(--white)'
                                        boxShadow='var(--boxShadowRed)'
                                    />
                                </div>
                            </div>
                            {/* Number of validators*/}
                            <div className='flex flex-col gap-y-1 xs:gap-y-5'>
                                <p
                                    className={`w-44 sm:w-60 font-semibold mb-2 text-${
                                        themeMode?.darkMode ? 'white' : 'black'
                                    }`}
                                >
                                    Number of Validators:
                                </p>
                                <div className='flex flex-col xl:flex-row items-end gap-x-4 gap-y-2'>
                                    <CardContent
                                        content={`Deposited: ${entityDay && entityDay.deposited?.toLocaleString()}`}
                                        bg='var(--depositedBlue)'
                                        color='var(--white)'
                                        boxShadow='var(--boxShadowBlue)'
                                    />
                                    <CardContent
                                        content={`Active: ${entityDay && entityDay.active?.toLocaleString()}`}
                                        bg='var(--proposedGreen)'
                                        color='var(--white)'
                                        boxShadow='var(--boxShadowGreen)'
                                    />
                                    <CardContent
                                        content={`Slashed: ${entityDay && entityDay.slashed?.toLocaleString()}`}
                                        bg='var(--missedRed)'
                                        color='var(--white)'
                                        boxShadow='var(--boxShadowRed)'
                                    />
                                    <CardContent
                                        content={`Exited: ${entityDay && entityDay.exited?.toLocaleString()}`}
                                        bg='var(--exitedPurple)'
                                        color='var(--white)'
                                        boxShadow='var(--boxShadowPurple)'
                                    />
                                </div>
                            </div>
                        </div>

                        {/* <div className='hidden md:block'>
                            <BlockGif poolName={name?.toString() ?? 'others'} width={150} height={150} />
                        </div> */}
                    </div>

                    {/* Time tabs */}
                    <div className='flex flex-col md:flex-row gap-4 mb-5 mt-5'>
                        <TabHeader
                            header='1 Hour'
                            isSelected={tabPageIndexEntityPerformance === 0}
                            onClick={() => {
                                setTabPageIndexEntityPerformance(0);
                            }}
                        />
                        <TabHeader
                            header='24 Hours'
                            isSelected={tabPageIndexEntityPerformance === 1}
                            onClick={() => {
                                setTabPageIndexEntityPerformance(1);
                            }}
                        />
                        <TabHeader
                            header='1 week'
                            isSelected={tabPageIndexEntityPerformance === 2}
                            onClick={() => {
                                setTabPageIndexEntityPerformance(2);
                            }}
                        />
                    </div>

                    <div
                        className='flex mx-auto p-8 rounded-md  border-2 border-white'
                        style={{
                            backgroundColor: themeMode?.darkMode ? 'var(--bgFairDarkMode)' : 'var(--bgMainLightMode)',
                            boxShadow: themeMode?.darkMode ? 'var(--boxShadowCardDark)' : 'var(--boxShadowCardLight)',
                            color: themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)',
                        }}
                    >
                        <div
                            className='items-start text-[12px] font-semibold md:text-[14px] mx-auto'
                            style={{
                                color: themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)',
                            }}
                        >
                            <div>
                                <div className='text-[18px] uppercase font-medium py-4 text-center'>
                                    <p className={`text-${themeMode?.darkMode ? 'white' : 'black'}`}>
                                        Entity performance:
                                    </p>
                                </div>
                                {tabPageIndexEntityPerformance === 0 && getEntityPerformance(entityHour as Entity)}
                                {tabPageIndexEntityPerformance === 1 && getEntityPerformance(entityDay as Entity)}
                                {tabPageIndexEntityPerformance === 2 && getEntityPerformance(entityWeek as Entity)}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showAnimation && <Animation text={`We're not there yet`} />}
        </Layout>
    );
};

export default EntityComponent;

import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// Axios
import axiosClient from '../../config/axios';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Components
import Layout from '../../components/layouts/Layout';
import Animation from '../../components/layouts/Animation';
import Loader from '../../components/ui/Loader';
import ProgressSmoothBar from '../../components/ui/ProgressSmoothBar';
import TabHeader from '../../components/ui/TabHeader';
import Title from '../../components/ui/Title';
import CardContent from '../../components/ui/CardContent';

// Types
import { Entity } from '../../types';

const EntityComponent = () => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    // Next router
    const router = useRouter();
    const { network, name } = router.query;

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

    //Entity
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

            if (responseHour.data.entity.aggregate_balance !== null) {
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
                    <p className='md:w-52 lg:w-50 text-[var(--black)] dark:text-[var(--white)]'>Rewards:</p>
                    <div className='w-[300px] text-center font-normal'>
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
                    <p className='md:w-52 lg:w-50 text-[var(--black)] dark:text-[var(--white)]'>
                        Sync committee participation:
                    </p>
                    <p className='capitalize text-[var(--black)] dark:text-[var(--white)]'>
                        {entity?.count_sync_committee} duties
                    </p>
                </div>

                {/* Attestation flags */}
                <div className='flex flex-col lg:flex-row py-4 gap-y-2 md:gap-y-0 md:mb-0'>
                    <p className='md:w-52 lg:w-50 text-[var(--black)] dark:text-[var(--white)]'>Attestation flags:</p>

                    {entity && (
                        <div className='flex flex-col xl:flex-row items-center gap-x-4 gap-y-2 font-medium text-[12px] md:text-[14px] text-[var(--black)] dark:text-[var(--white)]'>
                            <ProgressSmoothBar
                                title='Target'
                                color='var(--black)'
                                backgroundColor='var(--white)'
                                percent={1 - entity.count_missing_target / entity.count_expected_attestations}
                                width={300}
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
                                width={300}
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
                                width={300}
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
                    <p className='md:w-52 lg:w-50 text-[var(--black)] dark:text-[var(--white)]'>Blocks:</p>

                    <div className='flex justify-center'>
                        <div className='flex flex-col md:flex-row gap-x-4 gap-y-2'>
                            <CardContent
                                content={`Proposed: ${entity.proposed_blocks_performance}`}
                                bg='var(--proposedGreen)'
                                color='var(--white)'
                                boxShadow='var(--boxShadowGreen)'
                                width={200}
                            />

                            <CardContent
                                content={`Missed: ${entity.missed_blocks_performance}`}
                                bg='var(--missedRed)'
                                color='var(--white)'
                                boxShadow='var(--boxShadowRed)'
                                width={200}
                            />
                        </div>
                    </div>
                </div>
            </>
        );
    };

    //OVERVIEW PAGE
    return (
        <Layout>
            <Title className='uppercase'>{name}</Title>

            {loading && (
                <div className='mt-6'>
                    <Loader />
                </div>
            )}

            {entityDay && !showAnimation && (
                <div className='mx-auto w-11/12 md:w-10/12'>
                    <div
                        className='flex p-6 md:px-20 md:py-10 rounded-md gap-x-5  border-2 border-white text-[var(--darkGray)] dark:text-[var(--white)] bg-[var(--bgMainLightMode)] dark:bg-[var(--bgFairDarkMode)]'
                        style={{
                            boxShadow: themeMode?.darkMode ? 'var(--boxShadowCardDark)' : 'var(--boxShadowCardLight)',
                        }}
                    >
                        <div className='flex flex-col gap-y-8 text-[14px] md:text-[16px] font-medium mx-auto md:mx-0 text-[var(--darkGray)] dark:text-[var(--white)]'>
                            <div className='flex flex-row flex-wrap items-center gap-x-5'>
                                <p className='w-60 mb-2 text-[var(--black)] dark:text-[var(--white)]'>
                                    Aggregate Balance:
                                </p>
                                <p className='text-[var(--black)] dark:text-[var(--white)]'>
                                    {entityDay.aggregate_balance?.toLocaleString()} ETH
                                </p>
                            </div>
                            {/* Blocks */}
                            <div className='flex flex-col lg:flex-row gap-x-5 gap-y-1'>
                                <p className='w-44 sm:w-60 text-[var(--black)] dark:text-[var(--white)]'>Blocks:</p>
                                <div className='flex flex-col lg:flex-row items-center gap-x-4 gap-y-2'>
                                    <CardContent
                                        content={`Proposed: ${entityDay.proposed_blocks.f_proposed?.toLocaleString()}`}
                                        bg='var(--proposedGreen)'
                                        color='var(--white)'
                                        boxShadow='var(--boxShadowGreen)'
                                        width={200}
                                    />
                                    <CardContent
                                        content={`Missed: ${entityDay.proposed_blocks.f_missed?.toLocaleString()}`}
                                        bg='var(--missedRed)'
                                        color='var(--white)'
                                        boxShadow='var(--boxShadowRed)'
                                        width={200}
                                    />
                                </div>
                            </div>
                            {/* Number of validators*/}
                            <div className='flex flex-col gap-y-1 xs:gap-y-5'>
                                <p className='w-44 sm:w-60 mb-2 text-[var(--black)] dark:text-[var(--white)]'>
                                    Number of Validators:
                                </p>
                                <div className='flex flex-col xl:flex-row items-center gap-x-4 gap-y-2'>
                                    <CardContent
                                        content={`Deposited: ${entityDay.deposited?.toLocaleString()}`}
                                        bg='var(--depositedBlue)'
                                        color='var(--white)'
                                        boxShadow='var(--boxShadowBlue)'
                                        width={200}
                                    />
                                    <CardContent
                                        content={`Active: ${entityDay.active?.toLocaleString()}`}
                                        bg='var(--proposedGreen)'
                                        color='var(--white)'
                                        boxShadow='var(--boxShadowGreen)'
                                        width={200}
                                    />
                                    <CardContent
                                        content={`Slashed: ${entityDay.slashed?.toLocaleString()}`}
                                        bg='var(--missedRed)'
                                        color='var(--white)'
                                        boxShadow='var(--boxShadowRed)'
                                        width={200}
                                    />
                                    <CardContent
                                        content={`Exited: ${entityDay.exited?.toLocaleString()}`}
                                        bg='var(--exitedPurple)'
                                        color='var(--white)'
                                        boxShadow='var(--boxShadowPurple)'
                                        width={200}
                                    />
                                </div>
                            </div>
                        </div>
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
                            header='1 Day'
                            isSelected={tabPageIndexEntityPerformance === 1}
                            onClick={() => {
                                setTabPageIndexEntityPerformance(1);
                            }}
                        />
                        <TabHeader
                            header='1 Week'
                            isSelected={tabPageIndexEntityPerformance === 2}
                            onClick={() => {
                                setTabPageIndexEntityPerformance(2);
                            }}
                        />
                    </div>

                    <div
                        className='flex rounded-md  border-2 border-white text-[var(--darkGray)] dark:text-[var(--white)] bg-[var(--bgMainLightMode)] dark:bg-[var(--bgFairDarkMode)]'
                        style={{
                            boxShadow: themeMode?.darkMode ? 'var(--boxShadowCardDark)' : 'var(--boxShadowCardLight)',
                        }}
                    >
                        <div className='text-[14px] md:text-[16px] font-medium mx-auto text-[var(--darkGray)] dark:text-[var(--white)]'>
                            <div>
                                <div className='text-[18px] uppercase font-medium py-4 text-center'>
                                    <p className='text-[var(--black)] dark:text-[var(--white)]'>Entity performance:</p>
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

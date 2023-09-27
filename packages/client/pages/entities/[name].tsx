import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// Axios
import axiosClient from '../../config/axios';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Components
import Layout from '../../components/layouts/Layout';
import BlockGif from '../../components/ui/BlockGif';
import Animation from '../../components/layouts/Animation';
import Loader from '../../components/ui/Loader';

// Types
import { Entity } from '../../types';
import ProgressSmoothBar from '../../components/ui/ProgressSmoothBar';
import TabHeader from '../../components/ui/TabHeader';

type Props = {
    content: string;
    bg: string;
    color: string;
    rounded?: boolean;
    isFixedWidth?: boolean;
};

const CardContent = ({ content, bg, color, rounded, isFixedWidth }: Props) => {
    return (
        <span
            className={`block uppercase border-2 px-5 ${
                rounded ? 'rounded-2xl' : 'rounded-lg'
            } font-bold leading-5 py-0.5 sm:py-1 ${isFixedWidth ? 'w-44 sm:w-52 md:w-auto' : ''}`}
            style={{ background: bg, borderColor: color, color: color }}
        >
            {content}
        </span>
    );
};

const EntityComponent = () => {
    // Next router
    const router = useRouter();
    const {
        query: { name },
    } = router;

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
                        numberEpochs: hour,
                    },
                }),
                axiosClient.get(`/api/entities/${(name as string).toLowerCase()}`, {
                    params: {
                        numberEpochs: day,
                    },
                }),
                axiosClient.get(`/api/entities/${(name as string).toLowerCase()}`, {
                    params: {
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

    const getEntityPerformance = (entity: Entity) => {
        return (
            <>
                <div className='flex flex-col md:flex-row gap-x-4 ml-4 md:ml-10'>
                    <p className='md:w-52 lg:w-80'>Rewards:</p>
                    <div className='w-72 md:w-80 text-[9px] text-center leading-3'>
                        {entity && (
                            <ProgressSmoothBar
                                title=''
                                color='#1194BD'
                                backgroundColor='#BDFFEB'
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

                <div className='flex flex-col md:flex-row gap-x-4 gap-y-2 md:items-center ml-4 md:ml-10'>
                    <p className='md:w-52 lg:w-80'>Sync committee participation:</p>
                    <p className='leading-3'>{entity?.count_sync_committee} epochs</p>
                </div>

                <div className='flex flex-col md:flex-row gap-x-4 gap-y-2 md:items-center ml-4 md:ml-10'>
                    <p className='md:w-52 lg:w-80'>attestation flags:</p>

                    {entity && (
                        <div className='flex flex-col md:flex-row items-center gap-x-4 gap-y-2 text-[9px]'>
                            <ProgressSmoothBar
                                title='Target'
                                color='#E86506'
                                backgroundColor='#FFC163'
                                percent={1 - entity.count_missing_target / entity.count_expected_attestations}
                                width={150}
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
                                color='#14946e'
                                backgroundColor='#BDFFEB'
                                percent={1 - entity.count_missing_source / entity.count_expected_attestations}
                                width={150}
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
                                color='#532BC5'
                                backgroundColor='#E6DDFF'
                                percent={1 - entity.count_missing_head / entity.count_expected_attestations}
                                width={150}
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
                <div className='flex flex-col md:flex-row gap-x-4 gap-y-2 md:w-full ml-4 md:ml-10'>
                    <p className='md:w-52 lg:w-80'>Blocks:</p>

                    <div className='flex justify-center'>
                        <div className='flex flex-col md:flex-row gap-x-4 gap-y-2'>
                            <CardContent
                                content={`Proposed: ${entity.proposed_blocks_performance}`}
                                bg='#83E18C'
                                color='#00720B'
                                rounded
                            />

                            <CardContent
                                content={`Missed: ${entity.missed_blocks_performance}`}
                                bg='#FF9090'
                                color='#980E0E'
                                rounded
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
                <h1 className='text-white text-center text-xl md:text-3xl uppercase'>{name}</h1>
            </div>

            {loading && (
                <div className='mt-6'>
                    <Loader />
                </div>
            )}

            {entityDay && (
                <div className='mx-auto max-w-[1100px]'>
                    <div
                        className='flex mx-2 px-4 sm:px-10 py-5 rounded-[22px] justify-between items-center gap-x-5'
                        style={{
                            backgroundColor: themeMode?.darkMode ? 'var(--yellow2)' : 'var(--blue1)',
                            boxShadow: themeMode?.darkMode ? 'var(--boxShadowYellow1)' : 'var(--boxShadowBlue1)',
                        }}
                    >
                        <div className='flex flex-col gap-y-2 uppercase text-black leading-7 text-[8px] sm:text-[10px] mx-auto md:mx-0'>
                            <div className='flex flex-row items-center gap-x-5'>
                                <p className='leading-3 w-24 xs:w-44 sm:w-60'>Aggregate Balance:</p>
                                <p className='leading-3'>
                                    {entityDay && entityDay.aggregate_balance?.toLocaleString()} ETH
                                </p>
                            </div>

                            <div className='flex flex-col sm:flex-row gap-x-5 gap-y-1'>
                                <p className='w-44 sm:w-60'>Blocks:</p>
                                <div className='flex flex-col sm:flex-row sm:justify-center gap-x-4 gap-y-2'>
                                    <CardContent
                                        content={`Proposed: ${
                                            entityDay && entityDay.proposed_blocks.f_proposed?.toLocaleString()
                                        }`}
                                        bg='#83E18C'
                                        color='#00720B'
                                        rounded
                                    />
                                    <CardContent
                                        content={`Missed: ${
                                            entityDay && entityDay.proposed_blocks.f_missed?.toLocaleString()
                                        }`}
                                        bg='#FF9090'
                                        color='#980E0E'
                                        rounded
                                    />
                                </div>
                            </div>

                            <div className='flex flex-col gap-y-1 xs:gap-y-5'>
                                <p className='w-44 sm:w-60'>Number of Validators:</p>
                                <div className='flex flex-col md:flex-row items-center md:justify-center gap-x-4 gap-y-2'>
                                    <CardContent
                                        content={`Deposited: ${entityDay && entityDay.deposited?.toLocaleString()}`}
                                        bg='#98D3E6'
                                        color='#0080A9'
                                        isFixedWidth
                                    />
                                    <CardContent
                                        content={`Active: ${entityDay && entityDay.active?.toLocaleString()}`}
                                        bg='#9BD8A1'
                                        color='#00720B'
                                        isFixedWidth
                                    />
                                    <CardContent
                                        content={`Slashed: ${entityDay && entityDay.slashed?.toLocaleString()}`}
                                        bg='#EFB0B0'
                                        color='#980E0E'
                                        isFixedWidth
                                    />
                                    <CardContent
                                        content={`Exited: ${entityDay && entityDay.exited?.toLocaleString()}`}
                                        bg='#CDA4DC'
                                        color='#5D3BBD'
                                        isFixedWidth
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='hidden md:block'>
                            <BlockGif poolName={name?.toString() ?? 'others'} width={150} height={150} />
                        </div>
                    </div>

                    <div className='flex flex-col md:flex-row gap-4 mx-2 mb-5 mt-5'>
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
                        className='flex mx-2 px-4 xs:px-10 py-5 rounded-[22px] justify-between gap-x-5'
                        style={{
                            backgroundColor: themeMode?.darkMode ? 'var(--yellow2)' : 'var(--blue1)',
                            boxShadow: themeMode?.darkMode ? 'var(--boxShadowYellow1)' : 'var(--boxShadowBlue1)',
                        }}
                    >
                        <div className='flex flex-col gap-y-2 uppercase text-black leading-7 text-[8px] md:text-[10px]'>
                            <div className='flex flex-col gap-y-4'>
                                <div className='flex flex-row'>
                                    <p>Entity performance:</p>
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

import React, { useContext, useEffect, useState, useRef } from 'react';
import { GetServerSideProps } from 'next';

// Axios
import axiosClient from '../../config/axios';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Components
import Layout from '../../components/layouts/Layout';
import InfoBox from '../../components/layouts/InfoBox';
import Loader from '../../components/ui/Loader';
import ProgressSmoothBar from '../../components/ui/ProgressSmoothBar';
import TabHeader from '../../components/ui/TabHeader';
import Title from '../../components/ui/Title';
import CardContent from '../../components/ui/CardContent';
import ShareMenu from '../../components/ui/ShareMenu';

import BarChartComponent from '../../components/ui/BarChart';

// Types
import { Entity } from '../../types';

// Props
interface Props {
    name: string;
    network: string;
}

type Metrics = {
    missing_source: number;
    missing_target: number;
    missing_head: number;
    count_active_vals: number;
    count_missing_source: number;
    count_missing_target: number;
    count_missing_head: number;
};

function cleanOperatorName(entity: string | undefined) {
    if (!entity) {
        return 'others';
    }

    return entity
        .replace('_', ' ')
        .replace('_lido', '')
        .replace(/([a-zA-Z])(\d)/g, '$1 $2')
        .replace('csm', 'CSM')
        .replace(/\b\w/g, char => char.toUpperCase());
}

// Server Side Props
export const getServerSideProps: GetServerSideProps = async context => {
    const name = context.params?.name;
    const network = context.query?.network;

    if (!name || !network) {
        return {
            notFound: true,
        };
    }

    return { props: { name, network } };
};

const EntityComponent = ({ name, network }: Props) => {
    const cleanedName = cleanOperatorName(name);
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    // States
    const [entityHour, setEntityHour] = useState<Entity | null>(null);
    const [metricsOverallNetworkHour, setMetricsOverallNetworkHour] = useState<Metrics | null>(null);
    const [metricsCsmOperatorshour, setMetricsCsmOperatorshour] = useState<Metrics | null>(null);
    const [partRateHour, setPartRateHour] = useState<number | null>(null);
    const [entityDay, setEntityDay] = useState<Entity | null>(null);
    const [metricsOverallNetworkDay, setMetricsOverallNetworkDay] = useState<Metrics | null>(null);
    const [metricsCsmOperatorsDay, setMetricsCsmOperatorsDay] = useState<Metrics | null>(null);
    const [partRateDay, setPartRateDay] = useState<number | null>(null);
    const [entityWeek, setEntityWeek] = useState<Entity | null>(null);
    const [metricsOverallNetworkWeek, setMetricsOverallNetworkWeek] = useState<Metrics | null>(null);
    const [metricsCsmOperatorsWeek, setMetricsCsmOperatorsWeek] = useState<Metrics | null>(null);
    const [partRateWeek, setPartRateWeek] = useState<number | null>(null);
    const [entityMonth, setEntityMonth] = useState<Entity | null>(null);
    const [metricsOverallNetworkMonth, setMetricsOverallNetworkMonth] = useState<Metrics | null>(null);
    const [metricsCsmOperatorsMonth, setMetricsCsmOperatorsMonth] = useState<Metrics | null>(null);
    const [partRateMonth, setPartRateMonth] = useState<number | null>(null);
    const [showInfoBox, setShowInfoBox] = useState(false);
    const [tabPageIndexEntityPerformance, setTabPageIndexEntityPerformance] = useState(0);
    const [checkCsm, setCheckCsm] = useState(false);
    const [loading, setLoading] = useState(true);
    const getEntityCalled = useRef(false);

    // UseEffect
    useEffect(() => {
        if (!getEntityCalled.current) {
            getEntityCalled.current = true;
            getEntity();
        }
        if (name.includes('csm')) {
            setCheckCsm(true);
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
            const month = 6750;

            const [responseHour, responseDay, responseWeek, responseMonth] = await Promise.all([
                axiosClient.get(`/api/entities/${name.toLowerCase()}`, {
                    params: {
                        network,
                        numberEpochs: hour,
                    },
                }),
                axiosClient.get(`/api/entities/${name.toLowerCase()}`, {
                    params: {
                        network,
                        numberEpochs: day,
                    },
                }),
                axiosClient.get(`/api/entities/${name.toLowerCase()}`, {
                    params: {
                        network,
                        numberEpochs: week,
                    },
                }),
                axiosClient.get(`/api/entities/${name.toLowerCase()}`, {
                    params: {
                        network,
                        numberEpochs: month,
                    },
                }),
            ]);

            setEntityHour(responseHour.data.entity);
            setMetricsOverallNetworkHour(responseHour.data.metricsOverallNetwork);
            setMetricsCsmOperatorshour(responseHour.data.metricsCsmOperators);
            setPartRateHour(responseHour.data.participationRate);
            
            setEntityDay(responseDay.data.entity);
            setMetricsOverallNetworkDay(responseDay.data.metricsOverallNetwork);
            setMetricsCsmOperatorsDay(responseDay.data.metricsCsmOperators);
            setPartRateDay(responseDay.data.participationRate);
            setEntityWeek(responseWeek.data.entity);
            setMetricsOverallNetworkWeek(responseWeek.data.metricsOverallNetwork);
            setMetricsCsmOperatorsWeek(responseWeek.data.metricsCsmOperators);
            setPartRateWeek(responseWeek.data.participationRate);
            setEntityMonth(responseMonth.data.entity);
            setMetricsOverallNetworkMonth(responseMonth.data.metricsOverallNetwork);
            setMetricsCsmOperatorsMonth(responseMonth.data.metricsCsmOperators);
            setPartRateMonth(responseMonth.data.participationRate);

            if (responseHour.data.entity.aggregate_balance !== null) {
                setShowInfoBox(false);
            } else {
                setShowInfoBox(true);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    // Container Entity Performance
    const getEntityPerformance = (entity: Entity, overallNetwork: Metrics, csmOperators: Metrics, partRate: any) => {
        return (
            <>
                {/* Rewards */}
                <div className='flex flex-col md:flex-row gap-y-2 md:gap-y-0 md:mb-0'>
                    <p className='md:w-52 lg:w-50 my-auto text-[var(--black)] dark:text-[var(--white)]'>Rewards:</p>
                    <div className='flex flex-col xl:flex-row items-center gap-x-4 gap-y-2 font-medium text-[14px]'>
                        {entity && (
                            <ProgressSmoothBar
                                title=''
                                color='var(--black)'
                                backgroundColor='var(--white)'
                                percent={
                                    entity.aggregated_rewards >= 0
                                        ? entity.aggregated_rewards / entity.aggregated_max_rewards || 0
                                        : undefined
                                }
                                text={entity.aggregated_rewards < 0 ? `${entity.aggregated_rewards} GWEI` : undefined}
                                tooltipColor='blue'
                                tooltipContent={
                                    <>
                                        <span>Agg. Rewards: {entity?.aggregated_rewards}</span>
                                        <span>Max. Rewards: {entity?.aggregated_max_rewards}</span>
                                    </>
                                }
                                width={300}
                                widthTooltip={220}
                            />
                        )}
                    </div>
                </div>

                <div className='flex flex-col md:flex-row gap-y-2 md:gap-y-0 md:mb-0'>
                    <p className='md:w-52 lg:w-50 text-[var(--black)] dark:text-[var(--white)]'>
                        Sync committee participation:
                    </p>
                    <p className='font-medium capitalize text-[var(--black)] dark:text-[var(--white)] text-[14px] md:text-[16px] 3xs:mx-auto my-auto md:mx-0'>
                        {entity?.count_sync_committee} duties
                    </p>
                </div>

                {/* Blocks Entity Performance */}
                <div className='3xs:flex flex-col 3xs:flex-row items-center justify-between md:justify-start gap-x-1'>
                    <p className='md:w-52 lg:w-50 md:md-0 text-[var(--black)] dark:text-[var(--white)]'>Blocks:</p>

                    <div className='flex justify-center 3xs:gap-x-2 md:gap-x-5 3xs:my-2 '>
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
                {entity && checkCsm && (
                    <div className='flex flex-col lg:flex-row gap-y-2 md:gap-y-0 md:mb-0'>
                        <p className='md:w-52 lg:w-50 my-auto text-[var(--black)] dark:text-[var(--white)]'>Participation rate:</p>

                        <div className='flex flex-col xl:flex-row items-center gap-x-4 gap-y-2 font-medium text-[14px] text-[var(--black)] dark:text-[var(--white)]'>
                            <ProgressSmoothBar
                                title='Participation Rate'
                                color='var(--black)'
                                backgroundColor='var(--white)'
                                percent={partRate}
                                width={300}
                            />
                        </div>
                    </div>
                )}

                <div className='lg:flex-row gap-y-2 md:gap-y-0 md:mb-0 mt-10'>
                    <p className='text-[18px] md:w-[240px] my-auto text-[var(--black)] dark:text-[var(--white)] mx-auto'>
                        Correctness Comparison:
                    </p>
                    <div className="ml:h-[400px] 3xs:h-[200px] xs:h-[300px] md:w-[600px] ml:w-[750px] lg:w-[850px] xl:w-[1100px] 3xs:w-[355px] 2xs:w-[415px] xs:w-[520px] xl:mx-auto 3xs:ml-[-54px] md:ml-[-40px]" >
                        <BarChartComponent
                            data={checkCsm ? [
                                {name: 'Source', [cleanedName]: (1 - entity.count_missing_source / entity.count_expected_attestations), 'CSM': csmOperators?.missing_source, 'Overall Network': overallNetwork?.missing_source},
                                {name: 'Target', [cleanedName]: (1 - entity.count_missing_target / entity.count_expected_attestations), 'CSM': csmOperators?.missing_target, 'Overall Network': overallNetwork?.missing_target},
                                {name: 'Head', [cleanedName]: (1 - entity.count_missing_head / entity.count_expected_attestations), 'CSM': csmOperators?.missing_head, 'Overall Network': overallNetwork?.missing_head},
                            ] : [
                                {name: 'Source', [cleanedName]: (1 - entity.count_missing_source / entity.count_expected_attestations), 'Overall Network': overallNetwork?.missing_source},
                                {name: 'Target', [cleanedName]: (1 - entity.count_missing_target / entity.count_expected_attestations), 'Overall Network': overallNetwork?.missing_target},
                                {name: 'Head', [cleanedName]: (1 - entity.count_missing_head / entity.count_expected_attestations), 'Overall Network': overallNetwork?.missing_head},
                            ]}
                        ></BarChartComponent>
                    </div>
                </div>
            </>
        );
    };

    //OVERVIEW PAGE
    return (
        <Layout
            title={`Entity Profile: ${cleanedName} - Ethereum Staking | EthSeer.io`}
            description={`Explore the staking profile of ${cleanedName} on the Ethereum blockchain. View validator performance, total stakes, and more. Uncover staking insights with EthSeer.io.`}
        >
            <Title className='uppercase'>{cleanedName}</Title>

            {loading && (
                <div className='mt-6'>
                    <Loader />
                </div>
            )}

            {entityDay && !showInfoBox && (
                <div className='flex flex-col gap-y-4 mx-auto w-11/12 md:w-10/12'>
                    <div className='flex justify-end'>
                        <ShareMenu type='entity' />
                    </div>

                    <div
                        className='flex p-6 md:px-20 md:py-10 rounded-md gap-x-5 border-2 border-white text-[var(--darkGray)] dark:text-[var(--white)] bg-[var(--bgMainLightMode)] dark:bg-[var(--bgFairDarkMode)]'
                        style={{
                            boxShadow: themeMode?.darkMode ? 'var(--boxShadowCardDark)' : 'var(--boxShadowCardLight)',
                        }}
                    >
                        <div className='flex flex-col gap-y-8 text-[14px] md:text-[16px] font-medium mx-auto md:mx-0 text-[var(--darkGray)] dark:text-[var(--white)]'>
                            <div className='flex 3xs:flex-row items-center 3xs:justify-between md:justify-start'>
                                <p className='md:w-60 mb-2 my-auto text-[var(--black)] dark:text-[var(--white)] 3xs:my-auto'>
                                    Aggregate Balance:
                                </p>
                                <p className='text-[var(--black)] dark:text-[var(--white)] 3xs:w-[125px] md:w-[150px]'>
                                    {entityDay.aggregate_balance?.toLocaleString()} ETH
                                </p>
                            </div>

                            {/* Blocks */}
                            <div className='flex flex-col lg:flex-row gap-y-1'>
                                <p className='w-44 sm:w-60 my-auto text-[var(--black)] dark:text-[var(--white)]'>Blocks:</p>
                                <div className='flex flex-col 3xs:flex-row items-center 3xs:gap-x-4 md:gap-x-4 gap-y-2 justify-center'>
                                    <CardContent
                                        content={`Proposed: ${entityDay.proposed_blocks.f_proposed?.toLocaleString()}`}
                                        bg='var(--proposedGreen)'
                                        color='var(--white)'
                                        boxShadow='var(--boxShadowGreen)'
                                    />
                                    <CardContent
                                        content={`Missed: ${entityDay.proposed_blocks.f_missed?.toLocaleString()}`}
                                        bg='var(--missedRed)'
                                        color='var(--white)'
                                        boxShadow='var(--boxShadowRed)'
                                    />
                                </div>
                            </div>
                            {/* Number of validators*/}
                            <div className='flex flex-col lg:flex-row gap-y-1 xs:gap-y-5'>
                                <p className='w-44 sm:w-60 my-auto text-[var(--black)] dark:text-[var(--white)]'>
                                    Number of Validators:
                                </p>
                                <div className='flex flex-col flex-wrap 3xs:flex-row items-center gap-x-4 gap-y-2 justify-center'>
                                    <CardContent
                                        content={`Deposited: ${entityDay.deposited?.toLocaleString()}`}
                                        bg='var(--depositedBlue)'
                                        color='var(--white)'
                                        boxShadow='var(--boxShadowBlue)'
                                    />
                                    <CardContent
                                        content={`Active: ${entityDay.active?.toLocaleString()}`}
                                        bg='var(--proposedGreen)'
                                        color='var(--white)'
                                        boxShadow='var(--boxShadowGreen)'
                                    />
                                    <CardContent
                                        content={`Slashed: ${entityDay.slashed?.toLocaleString()}`}
                                        bg='var(--missedRed)'
                                        color='var(--white)'
                                        boxShadow='var(--boxShadowRed)'
                                    />
                                    <CardContent
                                        content={`Exited: ${entityDay.exited?.toLocaleString()}`}
                                        bg='var(--exitedPurple)'
                                        color='var(--white)'
                                        boxShadow='var(--boxShadowPurple)'
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Time tabs */}
                    <div className='flex flex-col 3xs:flex-row 3xs:gap-2 gap-4 3xs:justify-center sm:justify-start'>
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
                        <TabHeader
                            header='1 Month'
                            isSelected={tabPageIndexEntityPerformance === 3}
                            onClick={() => {
                                setTabPageIndexEntityPerformance(3);
                            }}
                        />
                    </div>

                    <div
                        className='2xl:flex items-center p-6 justify-center rounded-md border-2 border-white text-[var(--darkGray)] dark:text-[var(--white)] bg-[var(--bgMainLightMode)] dark:bg-[var(--bgFairDarkMode)]'
                        style={{
                            boxShadow: themeMode?.darkMode ? 'var(--boxShadowCardDark)' : 'var(--boxShadowCardLight)',
                        }}
                    >
                        <div className='flex flex-col md:gap-y-4 3xs:gap-y-4 text-[14px] font-medium md:text-[16px] text-[var(--darkGray)] dark:text-[var(--white)]'>
                            <p className='text-[18px] uppercase font-medium md:py-4 3xs:py-2 text-center text-[var(--black)] dark:text-[var(--white)]'>
                                Entity performance:
                            </p>
                            {tabPageIndexEntityPerformance === 0 && getEntityPerformance(entityHour as Entity, metricsOverallNetworkHour as Metrics, metricsCsmOperatorshour as Metrics, partRateHour)}
                            {tabPageIndexEntityPerformance === 1 && getEntityPerformance(entityDay as Entity, metricsOverallNetworkDay as Metrics, metricsCsmOperatorsDay as Metrics, partRateDay)}
                            {tabPageIndexEntityPerformance === 2 && getEntityPerformance(entityWeek as Entity, metricsOverallNetworkWeek as Metrics, metricsCsmOperatorsWeek as Metrics, partRateWeek)}
                            {tabPageIndexEntityPerformance === 3 && getEntityPerformance(entityMonth as Entity, metricsOverallNetworkMonth as Metrics, metricsCsmOperatorsMonth as Metrics, partRateMonth)}
                        </div>
                    </div>
                </div>
            )}

            {showInfoBox && <InfoBox text="Entity doesn't exist yet" />}
        </Layout>
    );
};

export default EntityComponent;

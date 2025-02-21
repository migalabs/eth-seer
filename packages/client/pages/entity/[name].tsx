import React, { useContext, useEffect, useState, useRef } from 'react';
import { GetServerSideProps } from 'next';

// Axios
import axiosClient from '../../config/axios';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Hooks
import useLargeView from '../../hooks/useLargeView';

// Components
import Layout from '../../components/layouts/Layout';
import InfoBox from '../../components/layouts/InfoBox';
import Loader from '../../components/ui/Loader';
import ProgressSmoothBar from '../../components/ui/ProgressSmoothBar';
import TabHeader from '../../components/ui/TabHeader';
import Title from '../../components/ui/Title';
import CardContent from '../../components/ui/CardContent';
import ShareMenu from '../../components/ui/ShareMenu';
import { LargeTable, LargeTableHeader, LargeTableRow, SmallTable, SmallTableCard } from '../../components/ui/Table';
import LinkValidator from '../../components/ui/LinkValidator';
import ValidatorStatus from '../../components/ui/ValidatorStatus';

import BarChartComponent from '../../components/ui/BarChart';

// Types
import { Entity, Validator } from '../../types';

import Pagination from '../../components/ui/Pagination';

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
    const [entityDay, setEntityDay] = useState<Entity | null>(null);
    const [entityWeek, setEntityWeek] = useState<Entity | null>(null);
    const [entityMonth, setEntityMonth] = useState<Entity | null>(null);
    const [metricsOverallNetworkHour, setMetricsOverallNetworkHour] = useState<Metrics | null>(null);
    const [metricsOverallNetworkDay, setMetricsOverallNetworkDay] = useState<Metrics | null>(null);
    const [metricsOverallNetworkWeek, setMetricsOverallNetworkWeek] = useState<Metrics | null>(null);
    const [metricsOverallNetworkMonth, setMetricsOverallNetworkMonth] = useState<Metrics | null>(null);
    const [metricsCsmOperatorshour, setMetricsCsmOperatorshour] = useState<Metrics | null>(null);
    const [metricsCsmOperatorsDay, setMetricsCsmOperatorsDay] = useState<Metrics | null>(null);
    const [metricsCsmOperatorsWeek, setMetricsCsmOperatorsWeek] = useState<Metrics | null>(null);
    const [metricsCsmOperatorsMonth, setMetricsCsmOperatorsMonth] = useState<Metrics | null>(null);
    const [partRateHour, setPartRateHour] = useState<number | null>(null);
    const [partRateDay, setPartRateDay] = useState<number | null>(null);
    const [partRateWeek, setPartRateWeek] = useState<number | null>(null);
    const [partRateMonth, setPartRateMonth] = useState<number | null>(null);

    const [showInfoBox, setShowInfoBox] = useState(false);
    const [tabPageIndexEntityPerformance, setTabPageIndexEntityPerformance] = useState(0);
    const [checkCsm, setCheckCsm] = useState(false);
    const [loading, setLoading] = useState(true);
    const getEntityCalled = useRef(false);
    const [partRateCsmHour, setPartRateCsmHour] = useState<number | null>(null);
    const [partRateCsmDay, setPartRateCsmDay] = useState<number | null>(null);
    const [partRateCsmWeek, setPartRateCsmWeek] = useState<number | null>(null);
    const [partRateCsmMonth, setPartRateCsmMonth] = useState<number | null>(null);
    const [partRateOverallHour, setPartRateOverallHour] = useState<number | null>(null);
    const [partRateOverallDay, setPartRateOverallDay] = useState<number | null>(null);
    const [partRateOverallWeek, setPartRateOverallWeek] = useState<number | null>(null);
    const [partRateOverallMonth, setPartRateOverallMonth] = useState<number | null>(null);

    const [validators, setValidators] = useState<Validator[]>([]);
    const [validatorsCount, setValidatorsCount] = useState(0);
    const [validatorsLoading, setValidatorsLoading] = useState(true);
    const isLargeView = useLargeView();

    const [currentPage, setCurrentPage] = useState(0);
    const [numRowsQuery, setNumRowsQuery] = useState(0);

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

    useEffect(() => {
        if (network && validators.length === 0) {
            getValidators(0, 10);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [network]);

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
            setEntityDay(responseDay.data.entity);
            setEntityWeek(responseWeek.data.entity);
            setEntityMonth(responseMonth.data.entity);
            setMetricsOverallNetworkHour(responseHour.data.metricsOverallNetwork);
            setMetricsOverallNetworkDay(responseDay.data.metricsOverallNetwork);
            setMetricsOverallNetworkWeek(responseWeek.data.metricsOverallNetwork);
            setMetricsOverallNetworkMonth(responseMonth.data.metricsOverallNetwork);
            setMetricsCsmOperatorshour(responseHour.data.metricsCsmOperators);
            setMetricsCsmOperatorsDay(responseDay.data.metricsCsmOperators);
            setMetricsCsmOperatorsWeek(responseWeek.data.metricsCsmOperators);
            setMetricsCsmOperatorsMonth(responseMonth.data.metricsCsmOperators);
            setPartRateHour(responseHour.data.participationRate);
            setPartRateDay(responseDay.data.participationRate);
            setPartRateWeek(responseWeek.data.participationRate);
            setPartRateMonth(responseMonth.data.participationRate);
            setPartRateCsmHour(responseHour.data.participationRateCsm);
            setPartRateCsmDay(responseDay.data.participationRateCsm);
            setPartRateCsmWeek(responseWeek.data.participationRateCsm);
            setPartRateCsmMonth(responseMonth.data.participationRateCsm);
            setPartRateOverallHour(responseHour.data.participationRateOverall);
            setPartRateOverallDay(responseDay.data.participationRateOverall);
            setPartRateOverallWeek(responseWeek.data.participationRateOverall);
            setPartRateOverallMonth(responseMonth.data.participationRateOverall);

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

    const getValidators = async (page: number, limit: number) => {
        try {
            setValidatorsLoading(true);

            setCurrentPage(page);
            setNumRowsQuery(limit);

            const response = await axiosClient.get(`/api/validators/pool/${name}`, {
                params: {
                    network,
                    page,
                    limit,
                },
            });

            setValidators(response.data.validators);
            setValidatorsCount(response.data.totalCount);
            console.log(validatorsCount);
            
        } catch (error) {
            console.log(error);
        } finally {
            setValidatorsLoading(false);
        }
    };


    // Container Entity Performance
    const getEntityPerformance = (entity: Entity, overallNetwork: Metrics, csmOperators: Metrics, partRate: any, partRateCsm: any, partRateOverall: any) => {
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
                    <p className='md:w-52 lg:w-50 md:md-0 text-[var(--black)] dark:text-[var(--white)]'>
                        Blocks:
                    </p>

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

                <div className='lg:flex-row gap-y-2 md:gap-y-0 md:mb-0'>
                    <p className='text-[18px] md:w-[240px] my-auto text-[var(--black)] dark:text-[var(--white)] mx-auto'>
                        Correctness Comparison:
                    </p>
                    <div className="3xs:h-[200px] xs:h-[300px] md:w-[600px] ml:w-[750px] lg:w-[850px] xl:w-[1100px] 3xs:w-[355px] 2xs:w-[415px] xs:w-[520px] xl:mx-auto 3xs:ml-[-54px] md:ml-[-40px]" >
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

                <div className='lg:flex-row gap-y-2 md:gap-y-0 md:mb-0'>
                    <p className='text-[18px] md:w-[290px] my-auto text-[var(--black)] dark:text-[var(--white)] mx-auto'>
                        Participation Rate Comparison:
                    </p>
                    <div className="3xs:h-[250px] xs:h-[300px] md:w-[400px] 3xs:w-[315px] xs:w-[520px] 3xs:mx-auto xl:mx-auto 3xs:ml-[-25px]" >
                        <BarChartComponent
                            data={checkCsm ? [
                                {name: '', [cleanedName]: partRate, 'CSM': partRateCsm, 'Overall Network': partRateOverall},
                            ] : [
                                {name: '', [cleanedName]: (1 - entity.count_missing_source / entity.count_expected_attestations), 'Overall Network': overallNetwork?.missing_source},
                            ]}
                        ></BarChartComponent>
                    </div>
                </div>
            </>
        );
    };

    // Large View
    const getValidatorsLargeView = () => (
        <LargeTable minWidth={700} noRowsText='No Validators' fetchingRows={validatorsLoading && !loading}>
            <LargeTableHeader text='Validator' />
            <LargeTableHeader text='Balance' />
            <LargeTableHeader text='Status' />

            {validators.map((validator: Validator) => (
                <LargeTableRow key={validator.f_val_idx}>
                    <div className='w-[25%]'>
                        <LinkValidator validator={validator.f_val_idx} mxAuto />
                    </div>

                    <p className='w-[25%] text-center'>{validator.f_balance_eth} ETH</p>

                    <div className='flex justify-center w-[25%]'>
                        <ValidatorStatus status={validator.f_status} />
                    </div>
                </LargeTableRow>
            ))}
        </LargeTable>
    );

    // Small View
    const getValidatorsMobile = () => (
        <SmallTable noRowsText='No Validators' fetchingRows={validatorsLoading}>
            {validators.map((validator: Validator) => (
                <SmallTableCard key={validator.f_val_idx}>
                    <div className='flex w-full items-center justify-between'>
                        <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>Validator</p>
                        <LinkValidator validator={validator.f_val_idx} />
                    </div>

                    <div className='flex w-full items-center justify-between'>
                        <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>Balance</p>
                        <p>{validator.f_balance_eth} ETH</p>
                    </div>

                    <div className='flex w-full items-center justify-between'>
                        <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>Status</p>
                        <ValidatorStatus status={validator.f_status} />
                    </div>
                </SmallTableCard>
            ))}
        </SmallTable>
    );

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
                                <p className='w-44 sm:w-60 my-auto text-[var(--black)] dark:text-[var(--white)]'>Blocks(All-time):</p>
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
                        className='2xl:flex items-center p-6 justify-center rounded-md border-2 border-white mb-5 text-[var(--darkGray)] dark:text-[var(--white)] bg-[var(--bgMainLightMode)] dark:bg-[var(--bgFairDarkMode)]'
                        style={{
                            boxShadow: themeMode?.darkMode ? 'var(--boxShadowCardDark)' : 'var(--boxShadowCardLight)',
                        }}
                    >
                        <div className='flex flex-col md:gap-y-4 3xs:gap-y-4 text-[14px] font-medium md:text-[16px] text-[var(--darkGray)] dark:text-[var(--white)]'>
                            <p className='text-[18px] uppercase font-medium md:py-4 3xs:py-2 text-center text-[var(--black)] dark:text-[var(--white)]'>
                                Entity performance
                            </p>
                            {tabPageIndexEntityPerformance === 0 && getEntityPerformance(entityHour as Entity, metricsOverallNetworkHour as Metrics, metricsCsmOperatorshour as Metrics, partRateHour, partRateCsmHour, partRateOverallHour)}
                            {tabPageIndexEntityPerformance === 1 && getEntityPerformance(entityDay as Entity, metricsOverallNetworkDay as Metrics, metricsCsmOperatorsDay as Metrics, partRateDay, partRateCsmDay, partRateOverallDay)}
                            {tabPageIndexEntityPerformance === 2 && getEntityPerformance(entityWeek as Entity, metricsOverallNetworkWeek as Metrics, metricsCsmOperatorsWeek as Metrics, partRateWeek, partRateCsmWeek, partRateOverallWeek)}
                            {tabPageIndexEntityPerformance === 3 && getEntityPerformance(entityMonth as Entity, metricsOverallNetworkMonth as Metrics, metricsCsmOperatorsMonth as Metrics, partRateMonth, partRateCsmMonth, partRateOverallMonth)}
                        </div>
                    </div>
                </div>
            )}

            {validatorsCount > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(validatorsCount / numRowsQuery)}
                    onChangePage={page => getValidators(page, numRowsQuery)}
                    onChangeNumRows={numRows => getValidators(0, numRows)}
                />
            )}

            <>{isLargeView ? getValidatorsLargeView() : getValidatorsMobile()}</>

            {showInfoBox && <InfoBox text="Entity doesn't exist yet" />}
        </Layout>
    );
};

export default EntityComponent;

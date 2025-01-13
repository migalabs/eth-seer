import React, { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// Axios
import axiosClient from '../config/axios';

// Hooks
import useLargeView from '../hooks/useLargeView';

// Components
import Layout from '../components/layouts/Layout';
import LinkEntity from '../components/ui/LinkEntity';
import Pagination from '../components/ui/Pagination';
import Title from '../components/ui/Title';
import { LargeTable, LargeTableHeader, LargeTableRow, SmallTable, SmallTableCard } from '../components/ui/Table';
import ProgressSmoothBar from '../components/ui/ProgressSmoothBar';
import ShareMenu from '../components/ui/ShareMenu';
import CardContent from '../components/ui/CardContent';
import ThemeModeContext from '../contexts/theme-mode/ThemeModeContext';

type Operator = {
    f_pool_name: string;
    aggregate_balance: number;
    act_number_validators: string;
    deposited: number;
    active: number;
    exited: number;
    slashed: number;
    f_proposed: number;
    f_missed: number;
    aggregated_rewards: number;
    aggregated_max_rewards: number;
};

const LidoCSM = () => {
    const router = useRouter();
    const { network } = router.query;

    const isLargeView = useLargeView();

    const [operators, setOperators] = useState<Operator[]>([]);
    const [operatorsBalance, setOperatorsBalance] = useState<Operator[]>([]);
    const [operatorsStats, setOperatorsStats] = useState<Operator[]>([]);
    const [operatorsCount, setOperatorsCount] = useState(0);
    const [rewards, setRewards] = useState<{ [key:string]: Operator }>({});
    const [loadingRewards, setLoadingRewards] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [numRowsQuery, setNumRowsQuery] = useState(0);

    const { themeMode } = useContext(ThemeModeContext) ?? {};

    useEffect(() => {
        const fetchRewards = async () => {
            setLoadingRewards(true);

            try {
                const rewardsPromises = operators.map(async (operator) => {
                    const rewardData = await getOperatorRewards(operator.f_pool_name);
                    return {name: operator.f_pool_name, rewardData };
                });

                const resolvedRewards = await Promise.all(rewardsPromises);

                const rewardsMap: { [key:string]: Operator } = {};
                resolvedRewards.forEach(({ name, rewardData }) => {
                    rewardsMap[name] = rewardData;
                });

                setRewards(rewardsMap);
            } catch (error) {
                console.log(error);
            } finally {
                setLoadingRewards(false);
            }
        };

        fetchRewards();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [operators]);

    useEffect(() => {
        if (network) {
            setOperators([]);
            setRewards({});
            getOperators(0, 10);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [network]);

    const totalBalance = operatorsBalance.reduce((sum, operator) => sum + operator.aggregate_balance, 0);
    const totalProposed = operatorsStats.reduce((sum, operator) => sum + operator.f_proposed, 0);
    const totalMissed = operatorsStats.reduce((sum, operator) => sum + operator.f_missed, 0);
    const totalDeposited = operatorsStats.reduce((sum, operator) => sum + operator.deposited, 0);
    const totalActive = operatorsStats.reduce((sum, operator) => sum + operator.active, 0);
    const totalExited = operatorsStats.reduce((sum, operator) => sum + operator.exited, 0);
    const totalSlashed = operatorsStats.reduce((sum, operator) => sum + operator.slashed, 0);

    const rewardsBar = (operator: Operator) => {
        return (
            <ProgressSmoothBar
                title=''
                color='var(--black)'
                backgroundColor='var(--white)'
                percent={
                    operator?.aggregated_rewards >= 0
                        ? operator?.aggregated_rewards / operator?.aggregated_max_rewards || 0
                        : undefined
                }
                text={operator?.aggregated_rewards < 0 ? `${operator.aggregated_rewards} GWEI` : undefined}
                tooltipColor='blue'
                tooltipContent={
                    <>
                        <span>Agg. Rewards: {operator?.aggregated_rewards}</span>
                        <span>Max. Rewards: {operator?.aggregated_max_rewards}</span>
                    </>
                }
                width={300}
                widthTooltip={220}
            />
        );
    }

    const getOperators = async (page: number, limit: number) => {
        try {
            setLoading(true);

            setCurrentPage(page);
            setNumRowsQuery(limit);

            const response = await axiosClient.get('/api/operators', {
                params: {
                    network,
                    page,
                    limit,
                },
            });

            setOperators(response.data.operators);
            setOperatorsBalance(response.data.operatorsBalance);
            setOperatorsStats(response.data.operatorsStats);
            setOperatorsCount(response.data.totalCount);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const month = 6750;

    async function getOperatorRewards(name: string) {
        const response = await axiosClient.get(`/api/entities/${name.toLowerCase()}`, {
                params: {
                    network,
                    numberEpochs: month,
                },
            });
        
        return response.data.entity;
    };

    const getOperatorsLargeView = () => (
        <LargeTable minWidth={700} noRowsText='No Operators' fetchingRows={loading}>
            <LargeTableHeader text='Operator' />
            <LargeTableHeader text='Balance' />
            <LargeTableHeader text='Number of Validators' />
            <LargeTableHeader text='Rewards' />

            {operators.map((operator: Operator) => (
                <LargeTableRow key={operator.f_pool_name}>
                    <div className='w-[25%]'>
                        <LinkEntity entity={operator.f_pool_name} mxAuto />
                    </div>

                    <p className='w-[25%] text-center'>{operator.aggregate_balance?.toLocaleString()} ETH</p>

                    <p className='w-[25%] text-center'>
                        {operator.act_number_validators}
                    </p>

                    <div className='w-[25%] text-center flex justify-center'>
                        {loadingRewards ? 'Loading...' : rewardsBar(rewards[operator.f_pool_name]) ?? 'N/A'}
                    </div>
                </LargeTableRow> 
            ))}
        </LargeTable>
    );

    const getOperatorsMobile = () => (
        <SmallTable noRowsText='No Operators' fetchingRows={loading}>
            {operators.map((operator: Operator) => (
                <div key={operator.f_pool_name}>
                    <SmallTableCard key={operator.f_pool_name}>
                        <div className='flex w-full items-center justify-between'>
                            <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>
                                Operator
                            </p>
                            <LinkEntity entity={operator.f_pool_name} />
                        </div>

                        <div className='flex w-full items-center justify-between'>
                            <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>
                                Balance
                            </p>
                            <p>
                                {operator.aggregate_balance?.toLocaleString()} ETH
                            </p>
                        </div>

                        <div className='flex w-full items-center justify-between'>
                            <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>
                                Number of Validators
                            </p>
                            <p className='text-[14px] font-medium ml-2'>
                                {operator.act_number_validators}
                            </p>
                        </div>

                        <div className='flex w-full items-center justify-between'>
                            <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>
                                Rewards
                            </p>
                            <p className='text-[14px] font-medium 3xs'>
                                {loadingRewards ? 'Loading...' : rewardsBar(rewards[operator.f_pool_name]) ?? 'N/A'}
                            </p> 
                        </div>
                    </SmallTableCard>
                </div>
            ))}
        </SmallTable>
    );

    return (
        <Layout
            title='Lido CSM - EthSeer.io'
            keywords='Lido CSM, Lido, CSM, Staking, Ethereum, Eth2, Operators, Staking Pools'
            canonical='https://ethseer.io/lido-csm'
        >

            <Title>Lido CSM</Title>

            <div className='flex flex-col gap-y-4 mx-auto w-11/12 md:w-10/12 mb-6'>
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
                                {totalBalance?.toLocaleString()} ETH
                            </p>
                        </div>

                        {/* Blocks */}
                        <div className='flex flex-col lg:flex-row gap-y-1'>
                            <p className='w-44 sm:w-60 my-auto text-[var(--black)] dark:text-[var(--white)]'>Blocks:</p>
                            <div className='flex flex-col 3xs:flex-row items-center 3xs:gap-x-4 md:gap-x-4 gap-y-2 justify-center'>
                                <CardContent
                                    content={`Proposed: ${totalProposed?.toLocaleString()}`}
                                    bg='var(--proposedGreen)'
                                    color='var(--white)'
                                    boxShadow='var(--boxShadowGreen)'
                                />
                                <CardContent
                                    content={`Missed: ${totalMissed?.toLocaleString()}`}
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
                                    content={`Deposited: ${totalDeposited?.toLocaleString()}`}
                                    bg='var(--depositedBlue)'
                                    color='var(--white)'
                                    boxShadow='var(--boxShadowBlue)'
                                />
                                <CardContent
                                    content={`Active: ${totalActive?.toLocaleString()}`}
                                    bg='var(--proposedGreen)'
                                    color='var(--white)'
                                    boxShadow='var(--boxShadowGreen)'
                                />
                                <CardContent
                                    content={`Slashed: ${totalSlashed?.toLocaleString()}`}
                                    bg='var(--missedRed)'
                                    color='var(--white)'
                                    boxShadow='var(--boxShadowRed)'
                                />
                                <CardContent
                                    content={`Exited: ${totalExited?.toLocaleString()}`}
                                    bg='var(--exitedPurple)'
                                    color='var(--white)'
                                    boxShadow='var(--boxShadowPurple)'
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {operatorsCount > 0 && (
                <div>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(operatorsCount / numRowsQuery)}
                        onChangePage={page => getOperators(page, numRowsQuery)}
                        onChangeNumRows={numRows => getOperators(0, numRows)}
                    />
                </div>
            )}

            <>{isLargeView ? getOperatorsLargeView() : getOperatorsMobile()}</>

        </Layout>
    );

};

export default LidoCSM;

import React, { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// Axios
import axiosClient from '../config/axios';

// Hooks
import useLargeView from '../hooks/useLargeView';

import Loader from '../components/ui/Loader';

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
    const [operatorsValidator, setOperatorsValidator] = useState<Operator[]>([]);
    const [operatorsBlock, setOperatorsBlock] = useState<Operator[]>([]);
    const [operatorsCount, setOperatorsCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [numRowsQuery, setNumRowsQuery] = useState(10);
    const [showInfoBox, setShowInfoBox] = useState(false);
    const [displayedOperators, setDisplayedOperators] = useState<Operator[]>([]);

    const { themeMode } = useContext(ThemeModeContext) ?? {};

    useEffect(() => {
        if (network) {
            setOperators([]);
            getOperators();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [network]);

    useEffect(() => {
        const startIndex = currentPage * numRowsQuery;
        const endIndex = startIndex + numRowsQuery;

        setDisplayedOperators(operators.slice(startIndex, endIndex));
    }, [currentPage, numRowsQuery, operators]);

    const totalBalance = operatorsBalance.reduce((sum, operator) => sum + operator.aggregate_balance, 0);
    const totalProposed = operatorsBlock.reduce((sum, operator) => sum + operator.f_proposed, 0);
    const totalMissed = operatorsBlock.reduce((sum, operator) => sum + operator.f_missed, 0);
    const totalDeposited = operatorsValidator.reduce((sum, operator) => sum + operator.deposited, 0);
    const totalActive = operatorsValidator.reduce((sum, operator) => sum + Number(operator.act_number_validators), 0);
    const totalExited = operatorsValidator.reduce((sum, operator) => sum + operator.exited, 0);
    const totalSlashed = operatorsValidator.reduce((sum, operator) => sum + operator.slashed, 0);

    const rewardsBar = (operator: Operator, width: number) => {
        if (!operator || operator?.aggregated_rewards === undefined || operator?.aggregated_max_rewards === undefined)
            return <span>N/A</span>
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
                width={width}
                widthTooltip={220}
            />
        );
    }

    const getOperators = async () => {
        try {
            setLoading(true);

            const response = await axiosClient.get('/api/csm-operators', {
                params: {
                    network
                },
            });

            setOperators(response.data.operators);
            setOperatorsBalance(response.data.operatorsBalance);
            setOperatorsValidator(response.data.operatorsValidator);
            setOperatorsBlock(response.data.operatorsBlock);
            setOperatorsCount(response.data.totalCount);

            setShowInfoBox(true);

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const getOperatorsLargeView = () => (
        <LargeTable minWidth={700} noRowsText='No Operators' fetchingRows={loading}>
            <LargeTableHeader text='Operator' />
            <LargeTableHeader text='Balance' />
            <LargeTableHeader text='Active Validators' />
            <LargeTableHeader text='Rewards (1 Month)' />

            {displayedOperators.map((operator: Operator) => (
                <LargeTableRow key={operator.f_pool_name}>
                    <div className='w-[25%]'>
                        <LinkEntity entity={operator.f_pool_name} mxAuto />
                    </div>

                    <p className='w-[25%] text-center'>{operator.aggregate_balance?.toLocaleString()} ETH</p>

                    <p className='w-[25%] text-center'>
                        {operator.act_number_validators}
                    </p>

                    <div className='w-[25%] text-center flex justify-center'>
                        {rewardsBar(operator, 300) ?? 'N/A'}
                    </div>
                </LargeTableRow> 
            ))}
        </LargeTable>
    );

    const getOperatorsMobile = () => (
        <SmallTable noRowsText='No Operators' fetchingRows={loading}>
            {operators.map((operator: Operator) => (
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
                            Active Validators
                        </p>
                        <p className='text-[14px] font-medium ml-2'>
                            {operator.act_number_validators}
                        </p>
                    </div>

                    <div className='flex w-full items-center justify-between'>
                        <div>
                            <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>
                                Rewards
                            </p>
                            <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>
                                (1 Month)
                            </p>
                        </div>
                        <p className='text-[14px] font-medium'>
                            {rewardsBar(operator, 160) ?? 'N/A'}
                        </p> 
                    </div>
                </SmallTableCard>
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

            {showInfoBox &&
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
            </div>}

            {operatorsCount > 0 && (
                <>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(operatorsCount / numRowsQuery)}
                        onChangePage={page => setCurrentPage(page)}
                        onChangeNumRows={numRows => setNumRowsQuery(numRows)}	
                    />
                </>
            )}

            {loading && (
                <div className='mt-6'>
                    <Loader />
                </div>
            )}

            {!loading && <>{isLargeView ? getOperatorsLargeView() : getOperatorsMobile()}</>}

        </Layout>
    );

};

export default LidoCSM;

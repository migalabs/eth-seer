import { useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

// Axios
import axiosClient from '../../config/axios';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Hooks
import useLargeView from '../../hooks/useLargeView';

// Components
import Layout from '../../components/layouts/Layout';
import BlockImage from '../../components/ui/BlockImage';
import TabHeader from '../../components/ui/TabHeader';
import InfoBox from '../../components/layouts/InfoBox';
import ProgressSmoothBar from '../../components/ui/ProgressSmoothBar';
import Loader from '../../components/ui/Loader';
import ValidatorStatus from '../../components/ui/ValidatorStatus';
import LinkEpoch from '../../components/ui/LinkEpoch';
import LinkSlot from '../../components/ui/LinkSlot';
import LinkEntity from '../../components/ui/LinkEntity';
import TitleWithArrows from '../../components/ui/TitleWithArrows';
import CardContent from '../../components/ui/CardContent';
import { LargeTable, LargeTableHeader, LargeTableRow, SmallTable, SmallTableCard } from '../../components/ui/Table';

// Types
import { Validator, Slot, Withdrawal } from '../../types';

const ValidatorComponent = () => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    // Next router
    const router = useRouter();
    const { network, id } = router.query;

    // Refs
    const validatorRef = useRef(0);

    // Large View Hook
    const isLargeView = useLargeView();

    // States
    const [validatorHour, setValidatorHour] = useState<Validator | null>(null);
    const [validatorDay, setValidatorDay] = useState<Validator | null>(null);
    const [validatorWeek, setValidatorWeek] = useState<Validator | null>(null);
    const [proposedBlocks, setProposedBlocks] = useState<Slot[]>([]);
    const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
    const [showInfoBox, setShowInfoBox] = useState(false);
    const [tabPageIndex, setTabPageIndex] = useState(0);
    const [tabPageIndexValidatorPerformance, setTabPageIndexValidatorPerformance] = useState(0);
    const [loadingValidator, setLoadingValidator] = useState(true);
    const [loadingProposedBlocks, setLoadingProposedBlocks] = useState(true);
    const [loadingWithdrawals, setLoadingWithdrawals] = useState(true);
    const [blockGenesis, setBlockGenesis] = useState(0);

    // UseEffect
    useEffect(() => {
        if (id) {
            validatorRef.current = Number(id);
        }

        if (network && ((id && !validatorHour) || (validatorHour && validatorHour.f_val_idx !== Number(id)))) {
            getValidator();
            getProposedBlocks();
            getWithdrawals();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [network, id]);

    const getValidator = async () => {
        try {
            setLoadingValidator(true);

            const hour = 9;
            const day = 225;
            const week = 1575;

            const [responseHour, responseDay, responseWeek, genesisBlock] = await Promise.all([
                axiosClient.get(`/api/validators/${id}`, {
                    params: {
                        network,
                        numberEpochs: hour,
                    },
                }),
                axiosClient.get(`/api/validators/${id}`, {
                    params: {
                        network,
                        numberEpochs: day,
                    },
                }),
                axiosClient.get(`/api/validators/${id}`, {
                    params: {
                        network,
                        numberEpochs: week,
                    },
                }),
                axiosClient.get(`/api/networks/block/genesis`, {
                    params: {
                        network,
                    },
                }),
            ]);

            setBlockGenesis(genesisBlock.data.block_genesis);
            setValidatorHour(responseHour.data.validator);
            setValidatorDay(responseDay.data.validator);
            setValidatorWeek(responseWeek.data.validator);

            if (responseHour.data.validator) {
                setShowInfoBox(false);
            } else {
                setShowInfoBox(true);
            }
        } catch (error) {
            console.log(error);
            setShowInfoBox(true);
        } finally {
            setLoadingValidator(false);
        }
    };

    const getProposedBlocks = async () => {
        try {
            setLoadingProposedBlocks(true);

            const response = await axiosClient.get(`/api/validators/${id}/proposed-blocks`, {
                params: {
                    network,
                },
            });

            setProposedBlocks(response.data.proposedBlocks);
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingProposedBlocks(false);
        }
    };

    const getWithdrawals = async () => {
        try {
            setLoadingWithdrawals(true);

            const response = await axiosClient.get(`/api/validators/${id}/withdrawals`, {
                params: {
                    network,
                },
            });

            setWithdrawals(response.data.withdrawals);
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingWithdrawals(false);
        }
    };

    const getContentValidator = () => (
        <>
            <div
                className='rounded-md p-6 md:px-20 md:py-10 gap-x-5 border-2 border-white text-[var(--black)] dark:text-[var(--white)] bg-[var(--bgMainLightMode)] dark:bg-[var(--bgFairDarkMode)]'
                style={{
                    boxShadow: themeMode?.darkMode ? 'var(--boxShadowCardDark)' : 'var(--boxShadowCardLight)',
                }}
            >
                <div className='flex flex-col gap-y-8 font-medium text-[14px] md:text-[16px] text-[var(--black)] dark:text-[var(--white)]'>
                    <div className='flex flex-row items-center justify-between md:justify-start  gap-x-5'>
                        <p className='md:w-52 lg:w-50 font-medium'>Entity:</p>
                        <div className='uppercase md:hover:underline underline-offset-4 decoration-2 text-[var(--darkPurple)] dark:text-[var(--purple)]'>
                            <LinkEntity entity={validatorHour?.f_pool_name} />
                        </div>
                    </div>

                    <div className='flex flex-row items-center justify-between md:justify-start gap-x-5'>
                        <p className='md:w-52 lg:w-50 '>Current balance:</p>
                        <p className='leading-3'>{validatorHour?.f_balance_eth} ETH</p>
                    </div>

                    <div className='flex md:flex-row gap-x-5 justify-between md:justify-start '>
                        <p className='md:w-52 lg:w-50 '>Current status:</p>
                        {validatorHour?.f_status && <ValidatorStatus status={validatorHour?.f_status} />}
                    </div>

                    <div className='flex flex-col sm:flex-row gap-x-5'>
                        <p className='md:w-52 lg:w-50 md:md-0 mb-2'>Blocks:</p>
                        <div className='flex justify-center gap-x-5 '>
                            <CardContent
                                content={`Proposed: ${getNumberProposedBlocks(proposedBlocks)}`}
                                color='var(--white)'
                                bg='var(--proposedGreen)'
                                boxShadow='var(--boxShadowGreen)'
                                width={200}
                            />
                            <CardContent
                                content={`Missed:  ${getNumberMissedBlocks(proposedBlocks)}`}
                                color='var(--white)'
                                bg='var(--missedRed)'
                                boxShadow='var(--boxShadowRed)'
                                width={200}
                            />
                        </div>
                    </div>
                    <div className='flex flex-row items-center gap-x-5 justify-between md:justify-start '>
                        <p className='md:w-52 lg:w-50'>Withdrawals:</p>
                        <p className='leading-3'>{getTotalWithdrawals(withdrawals).toLocaleString()} ETH</p>
                    </div>
                </div>
            </div>

            <div className='flex flex-col md:flex-row gap-4 my-5'>
                <TabHeader
                    header='1 Hour'
                    isSelected={tabPageIndexValidatorPerformance === 0}
                    onClick={() => {
                        setTabPageIndexValidatorPerformance(0);
                    }}
                />
                <TabHeader
                    header='1 Day'
                    isSelected={tabPageIndexValidatorPerformance === 1}
                    onClick={() => {
                        setTabPageIndexValidatorPerformance(1);
                    }}
                />
                <TabHeader
                    header='1 Week'
                    isSelected={tabPageIndexValidatorPerformance === 2}
                    onClick={() => {
                        setTabPageIndexValidatorPerformance(2);
                    }}
                />
            </div>

            <div
                className='flex items-center p-8 justify-center mx-auto rounded-md border-2 border-white text-[var(--black)] dark:text-[var(--white)] bg-[var(--bgMainLightMode)] dark:bg-[var(--bgFairDarkMode)]'
                style={{
                    boxShadow: themeMode?.darkMode ? 'var(--boxShadowCardDark)' : 'var(--boxShadowCardLight)',
                }}
            >
                <div className='flex flex-col gap-y-2 text-[14px] font-medium md:text-[16px] text-[var(--black)] dark:text-[var(--white)]'>
                    <div>
                        <div>
                            <p className='text-[18px] uppercase font-medium py-4 text-center'>Validator performance:</p>
                        </div>
                        {tabPageIndexValidatorPerformance === 0 && getValidatorPerformance(validatorHour as Validator)}
                        {tabPageIndexValidatorPerformance === 1 && getValidatorPerformance(validatorDay as Validator)}
                        {tabPageIndexValidatorPerformance === 2 && getValidatorPerformance(validatorWeek as Validator)}
                    </div>
                </div>
            </div>
        </>
    );

    const getNumberProposedBlocks = (proposed_blocks: Slot[]) => proposed_blocks.filter(item => item.f_proposed).length;

    //View missed blocks
    const getNumberMissedBlocks = (proposed_blocks: Slot[]) => proposed_blocks.filter(item => !item.f_proposed).length;

    //TABS
    //View tabs
    const getSelectedTab = () => {
        switch (tabPageIndex) {
            case 0:
                if (loadingProposedBlocks) {
                    return (
                        <div className='mt-6'>
                            <Loader />
                        </div>
                    );
                } else {
                    return isLargeView ? getProposedBlocksLargeView() : getProposedBlocksSmallView();
                }

            case 1:
                if (loadingWithdrawals) {
                    return (
                        <div className='mt-6'>
                            <Loader />
                        </div>
                    );
                } else {
                    return isLargeView ? getWithdrawalsLargeView() : getWithdrawalsSmallView();
                }
        }
    };

    //VALIDATOR PERFORMANCE TABLE
    //View validator performance table
    const getValidatorPerformance = (validator: Validator) => (
        <>
            <div className='flex flex-col md:flex-row py-4 gap-y-2 md:gap-y-0 md:mb-0'>
                <p className='md:w-52 lg:w-50'>Rewards:</p>
                <div className='w-[300px] text-center'>
                    {validator && (
                        <ProgressSmoothBar
                            title=''
                            color='var(--black)'
                            backgroundColor='var(--white)'
                            percent={validator.aggregated_rewards / validator.aggregated_max_rewards || 0}
                            tooltipColor='blue'
                            tooltipContent={
                                <>
                                    <span>Agg. Rewards: {validator?.aggregated_rewards}</span>
                                    <span>Max. Rewards: {validator?.aggregated_max_rewards}</span>
                                </>
                            }
                            widthTooltip={220}
                        />
                    )}
                </div>
            </div>

            <div className='flex flex-col md:flex-row py-4 gap-y-2 md:gap-y-0 md:mb-0'>
                <p className='md:w-52 lg:w-50'>Sync committee participation:</p>
                <p className='font-medium capitalize text-[14px] md:text-[16px]'>
                    {validator?.count_missing_source} duties
                </p>
            </div>

            {/* Attestation flags */}
            <div className='flex flex-col lg:flex-row py-4 gap-y-2 md:gap-y-0 md:mb-0'>
                <p className='md:w-52 lg:w-50'>Attestation flags:</p>

                {validator && (
                    <div className='flex flex-col xl:flex-row items-center gap-x-4 gap-y-2 font-medium text-[14px]'>
                        <ProgressSmoothBar
                            title='Target'
                            color='var(--black)'
                            backgroundColor='var(--white)'
                            percent={1 - validator.count_missing_target / validator.count_attestations}
                            width={300}
                            tooltipColor='orange'
                            tooltipContent={
                                <>
                                    <span>Missing Target: {validator.count_missing_target?.toLocaleString()}</span>
                                    <span>Attestations: {validator.count_attestations?.toLocaleString()}</span>
                                </>
                            }
                            widthTooltip={220}
                        />

                        <ProgressSmoothBar
                            title='Source'
                            color='var(--black)'
                            backgroundColor='var(--white)'
                            percent={1 - validator.count_missing_source / validator.count_attestations}
                            width={300}
                            tooltipColor='blue'
                            tooltipContent={
                                <>
                                    <span>Missing Source: {validator.count_missing_source?.toLocaleString()}</span>
                                    <span>Attestations: {validator.count_attestations?.toLocaleString()}</span>
                                </>
                            }
                            widthTooltip={220}
                        />

                        <ProgressSmoothBar
                            title='Head'
                            color='var(--black)'
                            backgroundColor='var(--white)'
                            percent={1 - validator.count_missing_head / validator.count_attestations}
                            width={300}
                            tooltipColor='purple'
                            tooltipContent={
                                <>
                                    <span>Missing Head: {validator.count_missing_head?.toLocaleString()}</span>
                                    <span>Attestations: {validator.count_attestations?.toLocaleString()}</span>
                                </>
                            }
                            widthTooltip={220}
                        />
                    </div>
                )}
            </div>

            <div className='flex flex-col md:flex-row py-4 gap-y-2 md:gap-y-0 md:mb-0'>
                <p className='md:w-52 lg:w-50'>Blocks:</p>

                <div className='flex justify-center'>
                    <div className='flex flex-col md:flex-row gap-x-4 gap-y-2'>
                        <CardContent
                            content={`Proposed: ${validator.proposed_blocks_performance}`}
                            color='var(--white)'
                            bg='var(--proposedGreen)'
                            boxShadow='var(--boxShadowGreen)'
                            width={200}
                        />

                        <CardContent
                            content={`Missed: ${validator.missed_blocks_performance}`}
                            color='var(--white)'
                            bg='var(--missedRed)'
                            boxShadow='var(--boxShadowRed)'
                            width={200}
                        />
                    </div>
                </div>
            </div>
        </>
    );

    // Proposed Blocks Large View
    const getProposedBlocksLargeView = () => (
        <LargeTable minWidth={700} fullWidth noRowsText='No Proposed Blocks' fetchingRows={loadingProposedBlocks}>
            <LargeTableHeader text='Block' />
            <LargeTableHeader text='Epoch' />
            <LargeTableHeader text='Slot' />
            <LargeTableHeader text='Time' />

            {proposedBlocks.map(block => (
                <LargeTableRow key={block.f_proposer_slot}>
                    <div className='w-[25%] flex items-center justify-center'>
                        <BlockImage
                            poolName={block.f_pool_name}
                            proposed={block.f_proposed}
                            width={60}
                            height={60}
                            showCheck
                        />
                    </div>

                    <div className='w-[25%]'>
                        <LinkEpoch epoch={Math.floor(block.f_proposer_slot / 32)} mxAuto />
                    </div>

                    <div className='w-[25%]'>
                        <LinkSlot slot={block.f_proposer_slot} mxAuto />
                    </div>

                    <p className='w-[25%]'>
                        {new Date(blockGenesis + Number(block.f_proposer_slot) * 12000).toLocaleString('ja-JP')}
                    </p>
                </LargeTableRow>
            ))}
        </LargeTable>
    );

    // Proposed Blocks Small View
    const getProposedBlocksSmallView = () => (
        <SmallTable fullWidth noRowsText='No Proposed Blocks' fetchingRows={loadingProposedBlocks}>
            {proposedBlocks.map(block => (
                <SmallTableCard key={block.f_proposer_slot}>
                    <div className='flex justify-between items-center gap-x-8 w-full'>
                        <BlockImage
                            poolName={block.f_pool_name}
                            proposed={block.f_proposed}
                            width={80}
                            height={80}
                            showCheck
                        />

                        <div className='flex flex-col gap-y-1'>
                            <div className='flex items-center justify-between'>
                                <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>Epoch:</p>
                                <LinkEpoch epoch={Math.floor(block.f_proposer_slot / 32)} />
                            </div>

                            <div className='flex items-center justify-between'>
                                <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>Slot:</p>
                                <LinkSlot slot={block.f_proposer_slot} />
                            </div>

                            <div className='flex items-center justify-between gap-x-2'>
                                <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>Time:</p>
                                <p>
                                    {new Date(blockGenesis + Number(block.f_proposer_slot) * 12000).toLocaleString(
                                        'ja-JP'
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </SmallTableCard>
            ))}
        </SmallTable>
    );

    //Withdrawals
    const getTotalWithdrawals = (withdrawals: Withdrawal[]) =>
        withdrawals.reduce((total, item) => total + item.f_amount / 10 ** 9, 0);

    // Withdrawals Large View
    const getWithdrawalsLargeView = () => (
        <LargeTable minWidth={700} fullWidth noRowsText='No Withdrawals' fetchingRows={loadingWithdrawals}>
            <LargeTableHeader text='Epoch' />
            <LargeTableHeader text='Slot' />
            <LargeTableHeader text='Time' />
            <LargeTableHeader text='Amount' />

            {withdrawals.map((withdrawal, idx) => (
                <LargeTableRow key={idx}>
                    <div className='w-[25%]'>
                        <LinkEpoch epoch={Math.floor(withdrawal.f_epoch ?? 0)} mxAuto />
                    </div>

                    <div className='w-[25%]'>
                        <LinkSlot slot={withdrawal.f_slot} mxAuto />
                    </div>

                    <p className='w-[25%]'>
                        {new Date(blockGenesis + Number(withdrawal.f_slot) * 12000).toLocaleString('ja-JP')}
                    </p>

                    <p className='w-[25%]'>{(withdrawal.f_amount / 10 ** 9).toLocaleString()} ETH</p>
                </LargeTableRow>
            ))}
        </LargeTable>
    );

    // Withdrawals Small View
    const getWithdrawalsSmallView = () => (
        <SmallTable fullWidth noRowsText='No Withdrawals' fetchingRows={loadingWithdrawals}>
            {withdrawals.map((widthdrawal, idx) => (
                <SmallTableCard key={idx}>
                    <div className='flex w-full items-center justify-between'>
                        <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>Epoch:</p>
                        <LinkEpoch epoch={Math.floor(widthdrawal.f_epoch ?? 0)} />
                    </div>

                    <div className='flex w-full items-center justify-between'>
                        <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>Slot:</p>
                        <LinkSlot slot={widthdrawal.f_slot} />
                    </div>

                    <div className='flex w-full items-center justify-between'>
                        <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>Time (Local):</p>
                        <p className='uppercase'>
                            {new Date(blockGenesis + Number(widthdrawal.f_slot) * 12000).toLocaleString('ja-JP')}
                        </p>
                    </div>

                    <div className='flex w-full items-center justify-between'>
                        <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>Amount:</p>
                        <p>{(widthdrawal.f_amount / 10 ** 9).toLocaleString()} ETH</p>
                    </div>
                </SmallTableCard>
            ))}
        </SmallTable>
    );

    //OVERVIEW PAGE
    //Overview validator page
    return (
        <Layout>
            <Head>
                <meta name='robots' property='noindex' />
            </Head>

            <TitleWithArrows type='validator' value={Number(id)} />

            {loadingValidator && (
                <div className='mb-4'>
                    <Loader />
                </div>
            )}

            {!loadingValidator && validatorHour && (
                <div className='flex flex-col gap-4 mx-auto w-11/12 md:w-10/12'>
                    <div>{getContentValidator()}</div>

                    <div className='flex flex-col md:flex-row gap-4'>
                        <TabHeader header='Blocks' isSelected={tabPageIndex === 0} onClick={() => setTabPageIndex(0)} />
                        <TabHeader
                            header='Withdrawals'
                            isSelected={tabPageIndex === 1}
                            onClick={() => setTabPageIndex(1)}
                        />
                    </div>

                    {getSelectedTab()}
                </div>
            )}

            {showInfoBox && <InfoBox text="Validator doesn't exist yet" />}
        </Layout>
    );
};

export default ValidatorComponent;

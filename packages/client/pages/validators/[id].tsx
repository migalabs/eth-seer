import { useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

// Axios
import axiosClient from '../../config/axios';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Components
import Layout from '../../components/layouts/Layout';
import BlockImage from '../../components/ui/BlockImage';
import BlockGif from '../../components/ui/BlockGif';
import TabHeader from '../../components/ui/TabHeader';
import Animation from '../../components/layouts/Animation';
import ProgressSmoothBar from '../../components/ui/ProgressSmoothBar';
import Loader from '../../components/ui/Loader';
import ValidatorStatus from '../../components/ui/ValidatorStatus';
import LinkEpoch from '../../components/ui/LinkEpoch';
import LinkSlot from '../../components/ui/LinkSlot';
import LinkEntity from '../../components/ui/LinkEntity';
import LinkValidator from '../../components/ui/LinkValidator';
import Arrow from '../../components/ui/Arrow';

// Types
import { Validator, Slot, Withdrawal } from '../../types';

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
            className='block px-5 rounded-md font-medium capitalize py-2 text-center w-52'
            style={{ background: color, borderColor: bg, color: bg, boxShadow: boxShadow }}
        >
            {content}
        </span>
    );
};

const ValidatorComponent = () => {
    // Next router
    const router = useRouter();
    const {
        query: { id },
    } = router;

    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    // Refs
    const validatorRef = useRef(0);
    const containerRef = useRef<HTMLInputElement>(null);

    // States
    const [validatorHour, setValidatorHour] = useState<Validator | null>(null);
    const [validatorDay, setValidatorDay] = useState<Validator | null>(null);
    const [validatorWeek, setValidatorWeek] = useState<Validator | null>(null);
    const [proposedBlocks, setProposedBlocks] = useState<Slot[]>([]);
    const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
    const [animation, setAnimation] = useState(false);
    const [desktopView, setDesktopView] = useState(true);
    const [tabPageIndex, setTabPageIndex] = useState(0);
    const [tabPageIndexValidatorPerformance, setTabPageIndexValidatorPerformance] = useState(0);
    const [loadingValidator, setLoadingValidator] = useState(true);
    const [loadingProposedBlocks, setLoadingProposedBlocks] = useState(true);
    const [loadingWithdrawals, setLoadingWithdrawals] = useState(true);

    // UseEffect
    useEffect(() => {
        if (id) {
            validatorRef.current = Number(id);
        }

        if ((id && !validatorHour) || (validatorHour && validatorHour.f_val_idx !== Number(id))) {
            getValidator();
            getProposedBlocks();
            getWithdrawals();
        }

        setDesktopView(window !== undefined && window.innerWidth > 768);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const getValidator = async () => {
        try {
            setLoadingValidator(true);

            const hour = 9;
            const day = 225;
            const week = 1575;

            const [responseHour, responseDay, responseWeek] = await Promise.all([
                axiosClient.get(`/api/validators/${id}`, {
                    params: {
                        numberEpochs: hour,
                    },
                }),
                axiosClient.get(`/api/validators/${id}`, {
                    params: {
                        numberEpochs: day,
                    },
                }),
                axiosClient.get(`/api/validators/${id}`, {
                    params: {
                        numberEpochs: week,
                    },
                }),
            ]);

            setValidatorHour(responseHour.data.validator);
            setValidatorDay(responseDay.data.validator);
            setValidatorWeek(responseWeek.data.validator);

            if (responseHour.data.validator) {
                setAnimation(false);
            } else {
                setAnimation(true);
            }
        } catch (error) {
            console.log(error);
            setAnimation(true);
        } finally {
            setLoadingValidator(false);
        }
    };

    const getProposedBlocks = async () => {
        try {
            setLoadingProposedBlocks(true);

            const response = await axiosClient.get(`/api/validators/${id}/proposed-blocks`);

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

            const response = await axiosClient.get(`/api/validators/${id}/withdrawals`);

            setWithdrawals(response.data.withdrawals);
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingWithdrawals(false);
        }
    };

    const handleMouseMove = (e: any) => {
        if (containerRef.current) {
            const x = e.pageX;
            const limit = 0.15;

            if (x < containerRef.current.clientWidth * limit) {
                containerRef.current.scrollLeft -= 10;
            } else if (x > containerRef.current.clientWidth * (1 - limit)) {
                containerRef.current.scrollLeft += 10;
            }
        }
    };

    const getContentProposedBlocksMobile = () => {
        return (
            <div
                className='mt-5 flex flex-col gap-y-2 mx-2 px-6 text-xs md:text-[16px] overflow-x-scroll overflow-y-hidden scrollbar-thin rounded-md border-2 py-3'
                style={{
                    backgroundColor: themeMode?.darkMode ? 'var(--bgFairDarkMode)' : 'var(--bgMainLightMode)',
                    boxShadow: themeMode?.darkMode ? 'var(--boxShadowCardDark)' : 'var(--boxShadowCardLight)',
                    color: themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)',
                }}
            >
                {proposedBlocks.map(element => (
                    <div className='flex flex-row gap-x-6 py-1' key={element.f_proposer_slot}>
                        <div className='flex items-center'>
                            <BlockImage
                                poolName={element.f_pool_name}
                                proposed={element.f_proposed}
                                width={60}
                                height={60}
                                showCheck
                            />
                        </div>
                        <div className='flex flex-col items-start'>
                            <div className='flex flex-row items-center gap-x-8'>
                                <p className='w-20 '>Epoch:</p>
                                <LinkEpoch epoch={Math.floor(element.f_proposer_slot / 32)} />
                            </div>

                            <div className='flex flex-row items-center gap-x-8'>
                                <p className='w-20'>Slot:</p>
                                <LinkSlot slot={element.f_proposer_slot} />
                            </div>

                            <div className='flex flex-row items-center gap-x-10'>
                                <p className='w-20'>DateTime:</p>
                                <p className='uppercase'>
                                    {new Date(FIRST_BLOCK + Number(element.f_proposer_slot) * 12000).toLocaleString(
                                        'ja-JP'
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}

                {proposedBlocks.length === 0 && (
                    <div className='flex justify-center p-2'>
                        <p className='uppercase'>No proposed blocks</p>
                    </div>
                )}
            </div>
        );
    };

    const getNumberProposedBlocks = (proposed_blocks: Slot[]) => {
        return proposed_blocks.filter(item => item.f_proposed).length;
    };

    const getNumberMissedBlocks = (proposed_blocks: Slot[]) => {
        return proposed_blocks.filter(item => !item.f_proposed).length;
    };

    const getTotalWithdrawals = (withdrawals: Withdrawal[]) => {
        return withdrawals.reduce((total, item) => total + item.f_amount / 10 ** 9, 0);
    };

    const getContentProposedBlocks = () => {
        return (
            <div
                ref={containerRef}
                className='flex flex-col px-2 overflow-x-scroll overflow-y-hidden scrollbar-thin'
                onMouseMove={handleMouseMove}
            >
                <div
                    className='flex gap-x-4 justify-around px-4 xl:px-8 min-w-[700px] py-3 text-xs md:text-[16px] text-center'
                    style={{
                        color: themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)',
                    }}
                >
                    <p className='mt-0.5 w-[25%]'>Block</p>
                    <p className='mt-0.5 w-[25%]'>Epoch</p>
                    <p className='mt-0.5 w-[25%]'>Slot</p>
                    <p className='mt-0.5 w-[25%]'>Datetime</p>
                </div>

                <div
                    className='flex flex-col gap-y-2 min-w-[700px] text-xs md:text-[14px] rounded-md border-2 border-white px-4 xl:px-8 py-3'
                    style={{
                        backgroundColor: themeMode?.darkMode ? 'var(--bgFairDarkMode)' : 'var(--bgMainLightMode)',
                        boxShadow: themeMode?.darkMode ? 'var(--boxShadowCardDark)' : 'var(--boxShadowCardLight)',
                        color: themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)',
                    }}
                >
                    {proposedBlocks.map(element => (
                        <div
                            className='flex gap-x-4 py-1 uppercase text-center items-center'
                            key={element.f_proposer_slot}
                        >
                            <div className='flex items-center justify-center w-[25%]'>
                                <BlockImage
                                    poolName={element.f_pool_name}
                                    proposed={element.f_proposed}
                                    width={60}
                                    height={60}
                                    showCheck
                                />
                            </div>

                            <div
                                className='w-[25%] font-medium md:hover:underline underline-offset-4 decoration-2'
                                style={{ color: themeMode?.darkMode ? 'var(--purple)' : 'var(--darkPurple)' }}
                            >
                                <LinkEpoch epoch={Math.floor(element.f_proposer_slot / 32)} mxAuto />
                            </div>

                            <div
                                className='w-[25%] font-medium md:hover:underline underline-offset-4 decoration-2'
                                style={{ color: themeMode?.darkMode ? 'var(--purple)' : 'var(--darkPurple)' }}
                            >
                                <LinkSlot slot={element.f_proposer_slot} mxAuto />
                            </div>

                            <p className='w-[25%]'>
                                {new Date(FIRST_BLOCK + Number(element.f_proposer_slot) * 12000).toLocaleString(
                                    'ja-JP'
                                )}
                            </p>
                        </div>
                    ))}

                    {proposedBlocks.length === 0 && (
                        <div className='flex justify-center p-2'>
                            <p className='uppercase'>No proposed blocks</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const getContentWithdrawals = () => {
        return (
            <div
                ref={containerRef}
                className='flex flex-col px-2 overflow-x-scroll overflow-y-hidden scrollbar-thin'
                onMouseMove={handleMouseMove}
            >
                <div
                    className='flex gap-x-4 justify-around px-4 xl:px-8 min-w-[700px] text-xs md:text-[16px] py-3 text-center'
                    style={{
                        color: themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)',
                    }}
                >
                    <p className='mt-0.5 w-[25%]'>Epoch</p>
                    <p className='mt-0.5 w-[25%]'>Slot</p>
                    <p className='mt-0.5 w-[25%]'>Datetime</p>
                    <p className='mt-0.5 w-[25%]'>Amount</p>
                </div>

                <div
                    className='flex flex-col gap-y-2 min-w-[700px] text-xs md:text-[14px] rounded-md border-2 border-white px-4 xl:px-8 py-3'
                    style={{
                        backgroundColor: themeMode?.darkMode ? 'var(--bgFairDarkMode)' : 'var(--bgMainLightMode)',
                        boxShadow: themeMode?.darkMode ? 'var(--boxShadowCardDark)' : 'var(--boxShadowCardLight)',
                        color: themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)',
                    }}
                >
                    {withdrawals.map((element, idx) => (
                        <div className='flex gap-x-4 py-1 uppercase text-center items-center' key={idx}>
                            <div
                                className='w-[25%] font-medium md:hover:underline underline-offset-4 decoration-2'
                                style={{ color: themeMode?.darkMode ? 'var(--purple)' : 'var(--darkPurple)' }}
                            >
                                <LinkEpoch epoch={Math.floor(element.f_epoch ?? 0)} mxAuto />
                            </div>

                            <div
                                className='w-[25%] font-medium md:hover:underline underline-offset-4 decoration-2'
                                style={{ color: themeMode?.darkMode ? 'var(--purple)' : 'var(--darkPurple)' }}
                            >
                                <LinkSlot slot={element.f_slot} mxAuto />
                            </div>

                            <p className='w-[25%]'>
                                {new Date(FIRST_BLOCK + Number(element.f_slot) * 12000).toLocaleString('ja-JP')}
                            </p>

                            <p className='w-[25%]'>{(element.f_amount / 10 ** 9).toLocaleString()} ETH</p>
                        </div>
                    ))}

                    {withdrawals.length === 0 && (
                        <div className='flex justify-center p-2'>
                            <p className='uppercase'>No withdrawals</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const getContentWithdrawalsMobile = () => {
        return (
            <div>
                {withdrawals.map((element, idx) => (
                    <div
                        className='flex flex-row justify-center items-center gap-x-6 py-2 mt-5 gap-y-1 mx-2 px-6 text-xs md:text-[16px] overflow-x-scroll overflow-y-hidden scrollbar-thin rounded-md border-2'
                        key={idx}
                        style={{
                            backgroundColor: themeMode?.darkMode ? 'var(--bgFairDarkMode)' : 'var(--bgMainLightMode)',
                            boxShadow: themeMode?.darkMode ? 'var(--boxShadowCardDark)' : 'var(--boxShadowCardLight)',
                            color: themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)',
                        }}
                    >
                        <div className='flex flex-col items-start gap-y-2'>
                            <div className='flex flex-row items-center gap-x-8'>
                                <p className='w-20'>Epoch:</p>
                                <LinkEpoch epoch={Math.floor(element.f_epoch ?? 0)} />
                            </div>

                            <div className='flex flex-row items-center gap-x-8'>
                                <p className='w-20'>Slot:</p>
                                <LinkSlot slot={element.f_slot} />
                            </div>

                            <div className='flex flex-row items-center gap-x-8'>
                                <p className='w-20'>DateTime:</p>
                                <p className='uppercase'>
                                    {new Date(FIRST_BLOCK + Number(element.f_slot) * 12000).toLocaleString('ja-JP')}
                                </p>
                            </div>

                            <div className='flex flex-row items-center gap-x-8'>
                                <p className='w-20'>Amount:</p>
                                <p>{(element.f_amount / 10 ** 9).toLocaleString()} ETH</p>
                            </div>
                        </div>
                    </div>
                ))}

                {withdrawals.length === 0 && (
                    <div className='flex justify-center p-2'>
                        <p className='uppercase text-xs md:text-[16px]'>No withdrawals</p>
                    </div>
                )}
            </div>
        );
    };

    const getValidatorPerformance = (validator: Validator) => {
        return (
            <>
                <div className='flex flex-col md:flex-row py-4 gap-y-2 md:gap-y-0 md:mb-0'>
                    <p className='md:w-52 lg:w-80'>Rewards:</p>
                    <div className='w-72 md:w-80 text-center'>
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
                    <p className='md:w-52 lg:w-80'>Sync committee participation:</p>
                    <p className='font-normal uppercase'>{validator?.count_missing_source} duties</p>
                </div>

                {/* Attestation flags */}
                <div className='flex flex-col lg:flex-row py-4 gap-y-2 md:gap-y-0 md:mb-0'>
                    <p className='md:w-52 lg:w-80'>Attestation flags:</p>

                    {validator && (
                        <div className='flex flex-col xl:flex-row items-center gap-x-4 gap-y-2 font-normal text-[12px]'>
                            <ProgressSmoothBar
                                title='Target'
                                color='var(--black)'
                                backgroundColor='var(--white)'
                                percent={1 - validator.count_missing_target / validator.count_attestations}
                                width={250}
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
                                width={250}
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
                                width={250}
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
                    <p className='md:w-52 lg:w-80'>Blocks:</p>

                    <div className='flex justify-center'>
                        <div className='flex flex-col md:flex-row gap-x-4 gap-y-2'>
                            <CardContent
                                content={`Proposed: ${validator.proposed_blocks_performance}`}
                                bg='var(--white)'
                                color='var(--proposedGreen)'
                                boxShadow='var(--boxShadowGreen)'
                            />

                            <CardContent
                                content={`Missed: ${validator.missed_blocks_performance}`}
                                bg='var(--white)'
                                color='var(--missedRed)'
                                boxShadow='var(--boxShadowRed)'
                            />
                        </div>
                    </div>
                </div>
            </>
        );
    };

    const getContentValidator = () => {
        return (
            <>
                <div
                    className='p-8 rounded-md gap-x-5 border-2 border-white mx-auto'
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
                            <p className='w-32 sm:w-40 font-semibold'>Entity:</p>
                            <div
                                className='uppercase font-medium md:hover:underline underline-offset-4 decoration-2'
                                style={{ color: themeMode?.darkMode ? 'var(--purple)' : 'var(--darkPurple)' }}
                            >
                                <LinkEntity entity={validatorHour?.f_pool_name ?? 'others'} />
                            </div>
                        </div>

                        <div className='flex flex-row items-center gap-x-5'>
                            <p className='w-32 sm:w-40 font-semibold'>Current balance:</p>
                            <p className='leading-3'>{validatorHour?.f_balance_eth} ETH</p>
                        </div>

                        <div className='flex md:flex-row gap-x-5'>
                            <p className='w-32 sm:w-40 font-semibold'>Current status:</p>
                            {validatorHour?.f_status && <ValidatorStatus status={validatorHour?.f_status} />}
                        </div>
                        <div className='flex flex-col sm:flex-row gap-x-5'>
                            <p className='w-32 sm:w-40 font-semibold'>Blocks:</p>
                            <div className='flex justify-center gap-x-5 '>
                                <CardContent
                                    content={`Proposed: ${getNumberProposedBlocks(proposedBlocks)}`}
                                    bg='var(--white)'
                                    color='var(--proposedGreen)'
                                    boxShadow='var(--boxShadowGreen)'
                                />
                                <CardContent
                                    content={`Missed:  ${getNumberMissedBlocks(proposedBlocks)}`}
                                    bg='var(--white)'
                                    color='var(--missedRed)'
                                    boxShadow='var(--boxShadowRed)'
                                />
                            </div>
                        </div>
                        <div className='flex flex-row items-center gap-x-5'>
                            <p className='w-32 sm:w-40 font-semibold'>Withdrawals:</p>
                            <p className='leading-3'>{getTotalWithdrawals(withdrawals).toLocaleString()} ETH</p>
                        </div>
                    </div>
                    {/* <div className='hidden md:block'>
                        <BlockGif poolName={validatorHour?.f_pool_name ?? 'others'} width={125} height={125} />
                    </div> */}
                </div>

                <div className='flex flex-col md:flex-row gap-4 mb-5 mt-5'>
                    <TabHeader
                        header='1 Hour'
                        isSelected={tabPageIndexValidatorPerformance === 0}
                        onClick={() => {
                            setTabPageIndexValidatorPerformance(0);
                        }}
                    />
                    <TabHeader
                        header='24 Hours'
                        isSelected={tabPageIndexValidatorPerformance === 1}
                        onClick={() => {
                            setTabPageIndexValidatorPerformance(1);
                        }}
                    />
                    <TabHeader
                        header='1 week'
                        isSelected={tabPageIndexValidatorPerformance === 2}
                        onClick={() => {
                            setTabPageIndexValidatorPerformance(2);
                        }}
                    />
                </div>

                <div
                    className='flex items-center justify-center mx-auto p-8 rounded-md border-2 border-white'
                    style={{
                        backgroundColor: themeMode?.darkMode ? 'var(--bgFairDarkMode)' : 'var(--bgMainLightMode)',
                        boxShadow: themeMode?.darkMode ? 'var(--boxShadowCardDark)' : 'var(--boxShadowCardLight)',
                        color: themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)',
                    }}
                >
                    <div
                        className='flex flex-col gap-y-2 text-[12px] font-semibold md:text-[14px]'
                        style={{
                            color: themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)',
                        }}
                    >
                        <div>
                            <div className=''>
                                <p className='text-[18px] uppercase font-medium py-4 text-center'>
                                    Validator performance:
                                </p>
                            </div>
                            {tabPageIndexValidatorPerformance === 0 &&
                                getValidatorPerformance(validatorHour as Validator)}
                            {tabPageIndexValidatorPerformance === 1 &&
                                getValidatorPerformance(validatorDay as Validator)}
                            {tabPageIndexValidatorPerformance === 2 &&
                                getValidatorPerformance(validatorWeek as Validator)}
                        </div>
                    </div>
                </div>
            </>
        );
    };

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
                    return desktopView ? getContentProposedBlocks() : getContentProposedBlocksMobile();
                }

            case 1:
                if (loadingWithdrawals) {
                    return (
                        <div className='mt-6'>
                            <Loader />
                        </div>
                    );
                } else {
                    return desktopView ? getContentWithdrawals() : getContentWithdrawalsMobile();
                }
        }
    };

    return (
        <Layout>
            <Head>
                <meta name='robots' property='noindex' />
            </Head>

            <div className='flex gap-x-3 justify-center items-center mt-14 xl:mt-0 mb-5'>
                <LinkValidator validator={Number(id) - 1}>
                    <Arrow direction='left' />
                </LinkValidator>

                <h1 className='text-black text-center font-medium md:text-[40px] text-[30px]' 
                style={{
                        color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)'
                    }} >
                    Validator {Number(id)?.toLocaleString()}
                </h1>

                <LinkValidator validator={Number(id) + 1}>
                    <Arrow direction='right' />
                </LinkValidator>
            </div>

            {loadingValidator && (
                <div className='mt-6'>
                    <Loader />
                </div>
            )}

            {!loadingValidator && validatorHour && (
                <div className='flex flex-col gap-4 mx-auto w-11/12 md:w-10/12'>
                    <div>{getContentValidator()}</div>

                    <div className='flex flex-col md:flex-row gap-4 mx-2'>
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

            {animation && <Animation text={`Validator doesn't exist yet`} />}
        </Layout>
    );
};

export default ValidatorComponent;

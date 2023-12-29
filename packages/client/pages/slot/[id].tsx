import React, { useEffect, useState, useRef, useCallback, useContext } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

// Axios
import axiosClient from '../../config/axios';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Components
import Layout from '../../components/layouts/Layout';
import TabHeader from '../../components/ui/TabHeader';
import Loader from '../../components/ui/Loader';
import LinkValidator from '../../components/ui/LinkValidator';
import LinkEpoch from '../../components/ui/LinkEpoch';
import LinkEntity from '../../components/ui/LinkEntity';
import LinkBlock from '../../components/ui/LinkBlock';
import EpochAnimation from '../../components/layouts/EpochAnimation';
import Card from '../../components/ui/Card';
import TitleWithArrows from '../../components/ui/TitleWithArrows';

// Types
import { Block, Withdrawal } from '../../types';

const Slot = () => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    // Next router
    const router = useRouter();
    const { network, id } = router.query;

    // Refs
    const slotRef = useRef(0);
    const existsBlockRef = useRef(true);
    const containerRef = useRef<HTMLInputElement>(null);

    // States
    const [block, setBlock] = useState<Block | null>(null);
    const [withdrawals, setWithdrawals] = useState<Array<Withdrawal>>([]);
    const [existsBlock, setExistsBlock] = useState<boolean>(true);
    const [countdownText, setCountdownText] = useState<string>('');
    const [tabPageIndex, setTabPageIndex] = useState<number>(0);
    const [loadingBlock, setLoadingBlock] = useState<boolean>(true);
    const [loadingWithdrawals, setLoadingWithdrawals] = useState<boolean>(true);
    const [desktopView, setDesktopView] = useState(true);
    const [blockGenesis, setBlockGenesis] = useState(0);

    // UseEffect
    useEffect(() => {
        if (id) {
            slotRef.current = Number(id);
        }

        if (network && ((id && !block) || (block && block.f_slot !== Number(id)))) {
            getBlock();
            getWithdrawals();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [network, id]);
    useEffect(() => {
        setDesktopView(window !== undefined && window.innerWidth > 768);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const shuffle = useCallback(() => {
        const text: string = getCountdownText();
        setCountdownText(text);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const intervalID = setInterval(shuffle, 1000);
        return () => clearInterval(intervalID);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shuffle, slotRef.current]);

    // Get blocks
    const getBlock = async () => {
        try {
            setLoadingBlock(true);

            const [response, genesisBlock] = await Promise.all([
                axiosClient.get(`/api/slots/${id}`, {
                    params: {
                        network,
                    },
                }),
                axiosClient.get(`/api/networks/block/genesis`, {
                    params: {
                        network,
                    },
                }),
            ]);

            const blockResponse: Block = response.data.block;
            setBlock(blockResponse);
            setBlockGenesis(genesisBlock.data.block_genesis);

            if (!blockResponse) {
                const expectedTimestamp = (genesisBlock.data.block_genesis + Number(id) * 12000) / 1000;

                setBlock({
                    f_epoch: Math.floor(Number(id) / 32),
                    f_slot: Number(id),
                    f_timestamp: expectedTimestamp,
                });

                setExistsBlock(false);
                existsBlockRef.current = false;

                const timeDifference = new Date(expectedTimestamp * 1000).getTime() - new Date().getTime();

                if (timeDifference > 0) {
                    setTimeout(() => {
                        if (Number(id) === slotRef.current) {
                            getBlock();
                        }
                    }, timeDifference + 2000);
                } else if (timeDifference > -10000) {
                    setTimeout(() => {
                        if (Number(id) === slotRef.current) {
                            getBlock();
                        }
                    }, 1000);
                }
            } else {
                setExistsBlock(true);
                existsBlockRef.current = true;
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingBlock(false);
        }
    };

    // Get withdrawals
    const getWithdrawals = async () => {
        try {
            setLoadingWithdrawals(true);

            const response = await axiosClient.get(`/api/slots/${id}/withdrawals`, {
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

    // Get Short Address
    const getShortAddress = (address: string | undefined) => {
        return address && `${address.slice(0, 6)}...${address.slice(address.length - 6, address.length)}`;
    };

    // Get Time Block
    const getTimeBlock = () => {
        let text;

        if (block) {
            if (block.f_timestamp) {
                text = new Date(block.f_timestamp * 1000).toLocaleString('ja-JP');
            } else {
                text = new Date(blockGenesis + Number(id) * 12000).toLocaleString('ja-JP');
            }
        }

        return text + countdownText;
    };

    // Get Countdown Text
    const getCountdownText = () => {
        let text = '';

        if (!existsBlockRef.current) {
            const expectedTimestamp = (blockGenesis + slotRef.current * 12000) / 1000;
            const timeDifference = new Date(expectedTimestamp * 1000).getTime() - new Date().getTime();

            const minutesMiliseconds = 1000 * 60;
            const hoursMiliseconds = minutesMiliseconds * 60;
            const daysMiliseconds = hoursMiliseconds * 24;
            const yearsMiliseconds = daysMiliseconds * 365;

            if (timeDifference > yearsMiliseconds) {
                const years = Math.floor(timeDifference / yearsMiliseconds);
                text = ` (in ${years} ${years > 1 ? 'years' : 'year'})`;
            } else if (timeDifference > daysMiliseconds) {
                const days = Math.floor(timeDifference / daysMiliseconds);
                text = ` (in ${days} ${days > 1 ? 'days' : 'day'})`;
            } else if (timeDifference > hoursMiliseconds) {
                const hours = Math.floor(timeDifference / hoursMiliseconds);
                text = ` (in ${hours} ${hours > 1 ? 'hours' : 'hour'})`;
            } else if (timeDifference > minutesMiliseconds) {
                const minutes = Math.floor(timeDifference / minutesMiliseconds);
                text = ` (in ${minutes} ${minutes > 1 ? 'minutes' : 'minute'})`;
            } else if (timeDifference > 1000) {
                const seconds = Math.floor(timeDifference / 1000);
                text = ` (in ${seconds} ${seconds > 1 ? 'seconds' : 'second'})`;
            } else if (timeDifference < -10000) {
                text = ' (data not saved)';
            } else {
                text = ' (updating...)';
            }
        }

        return text;
    };

    // Get Handle Mouse
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

    //TABLE

    //TABS
    const getSelectedTab = () => {
        switch (tabPageIndex) {
            case 0:
                return getOverview();

            case 1:
                return desktopView ? getWithdrawalsDesktop() : getWithdrawalsMobile();
        }
    };

    //TABS - Overview & withdrawals
    const getInformationView = () => {
        return (
            <div className='flex flex-col w-11/12 md:w-1/2 mx-auto'>
                <div className='flex flex-col sm:flex-row gap-4'>
                    <TabHeader header='Overview' isSelected={tabPageIndex === 0} onClick={() => setTabPageIndex(0)} />

                    {existsBlock && (
                        <TabHeader
                            header='Withdrawals'
                            isSelected={tabPageIndex === 1}
                            onClick={() => setTabPageIndex(1)}
                        />
                    )}
                </div>
                {getSelectedTab()}
            </div>
        );
    };

    //Overview tab - table
    const getOverview = () => {
        return (
            <div
                className='rounded-md mt-4 p-8 border-2 border-white text-[var(--black)] dark:text-[var(--white)] bg-[var(--bgMainLightMode)] dark:bg-[var(--bgFairDarkMode)]'
                style={{
                    boxShadow: themeMode?.darkMode ? 'var(--boxShadowCardDark)' : 'var(--boxShadowCardLight)',
                }}
            >
                {/* Table */}
                <div className='flex flex-col mx-auto gap-y-5 md:gap-y-8 '>
                    <Card title='Epoch' content={<LinkEpoch epoch={block?.f_epoch} />} />
                    <Card title='Block number' content={<LinkBlock block={block?.f_el_block_number} />} />
                    <Card title='Slot' text={block?.f_slot?.toLocaleString()} />

                    {existsBlock && (
                        <Card
                            title='Entity'
                            content={<LinkEntity entity={block?.f_pool_name?.toLocaleString() ?? 'others'} />}
                        />
                    )}

                    {existsBlock && network === 'mainnet' && (
                        <Card title='Client' text={block?.f_cl_client?.toLocaleString() ?? 'others'} />
                    )}

                    {existsBlock && (
                        <Card
                            title='Status'
                            content={
                                block?.f_proposed ? (
                                    <span
                                        className='bg-[#53945a] text-white md:w-52 w-40 px-6 text-center py-2 text-[14px] md:text-[16px] rounded-md capitalize font-medium'
                                        style={{ boxShadow: 'var(--boxShadowGreen)' }}
                                    >
                                        Proposed
                                    </span>
                                ) : (
                                    <span
                                        className='bg-[#e86666] text-white md:w-52 w-40 px-6 py-2 text-center text-[14px] md:text-[16px] rounded-md capitalize font-medium'
                                        style={{ boxShadow: 'var(--boxShadowRed)' }}
                                    >
                                        Missed
                                    </span>
                                )
                            }
                        />
                    )}

                    <Card title='Datetime (Local)' text={getTimeBlock()} />

                    {existsBlock && (
                        <Card title='Proposer index' content={<LinkValidator validator={block?.f_proposer_index} />} />
                    )}

                    {existsBlock && <Card title='Graffiti' text={block?.f_proposed ? block?.f_graffiti : '---'} />}

                    {existsBlock && (
                        <Card
                            title='Sync bits'
                            text={block?.f_proposed ? block?.f_sync_bits?.toLocaleString() : '---'}
                        />
                    )}

                    {existsBlock && (
                        <Card
                            title='Attestations'
                            text={block?.f_proposed ? block?.f_attestations?.toLocaleString() : '---'}
                        />
                    )}

                    {existsBlock && (
                        <Card
                            title='Voluntary exits'
                            text={block?.f_proposed ? block?.f_voluntary_exits?.toLocaleString() : '---'}
                        />
                    )}

                    {existsBlock && (
                        <Card
                            title='Proposer slashings'
                            text={block?.f_proposed ? block?.f_proposer_slashings?.toLocaleString() : '---'}
                        />
                    )}

                    {existsBlock && (
                        <Card
                            title='Attestation Slashing'
                            text={block?.f_proposed ? block?.f_att_slashings?.toLocaleString() : '---'}
                        />
                    )}

                    {existsBlock && (
                        <Card title='Deposits' text={block?.f_proposed ? block?.f_deposits?.toLocaleString() : '---'} />
                    )}
                </div>
            </div>
        );
    };

    //Withdrawals tab - table desktop
    const getWithdrawalsDesktop = () => {
        return (
            <div
                ref={containerRef}
                className='flex flex-col mt-2.5 overflow-x-scroll overflow-y-hidden scrollbar-thin'
                onMouseMove={handleMouseMove}
            >
                <div className='flex gap-x-4 justify-around px-4 xl:px-8 min-w-[470px] font-semibold py-3 text-[14px] md:text-[16px] text-center text-[var(--darkGray)] dark:text-[var(--white)]'>
                    <p className='mt-0.5 w-1/3'>Validator</p>
                    <p className='mt-0.5 w-1/3'>Address</p>
                    <p className='mt-0.5 w-1/3'>Amount</p>
                </div>

                {loadingWithdrawals ? (
                    <div className='mt-6'>
                        <Loader />
                    </div>
                ) : (
                    <div
                        className='font-medium flex flex-col gap-y-2 min-w-[470px] text-[14px] md:text-[16px] rounded-md border-2 border-white px-4 xl:px-8 py-3 text-[var(--black)] dark:text-[var(--white)] bg-[var(--bgMainLightMode)] dark:bg-[var(--bgFairDarkMode)]'
                        style={{
                            boxShadow: themeMode?.darkMode ? 'var(--boxShadowCardDark)' : 'var(--boxShadowCardLight)',
                        }}
                    >
                        {withdrawals.map(element => (
                            <div
                                className='flex gap-x-4 py-1 uppercase text-center items-center'
                                key={element.f_val_idx}
                            >
                                <div className='w-1/3'>
                                    <LinkValidator validator={element.f_val_idx} mxAuto />
                                </div>

                                <div className='w-1/3'>
                                    <p>{getShortAddress(element?.f_address)}</p>
                                </div>

                                <p className='w-1/3'>{(element.f_amount / 10 ** 9).toLocaleString()} ETH</p>
                            </div>
                        ))}

                        {withdrawals.length == 0 && (
                            <div className='flex justify-center p-2'>
                                <p className='uppercase text-[14px] md:text-[16px]'>No withdrawals</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    //Withdrawals tab - table mobile
    const getWithdrawalsMobile = () => {
        return (
            <div
                ref={containerRef}
                className='my-2 flex flex-col gap-2 font-medium text-[12px] text-[var(--black)] dark:text-[var(--white)]'
                onMouseMove={handleMouseMove}
            >
                {loadingWithdrawals ? (
                    <div className='mt-6'>
                        <Loader />
                    </div>
                ) : (
                    <div>
                        {withdrawals.map(element => (
                            <div
                                className='flex my-2 flex-col gap-y-2 text-[14px] py-4 px-14 border-2 border-white rounded-md text-[var(--black)] dark:text-[var(--white)] bg-[var(--bgMainLightMode)] dark:bg-[var(--bgFairDarkMode)]'
                                style={{
                                    boxShadow: themeMode?.darkMode
                                        ? 'var(--boxShadowCardDark)'
                                        : 'var(--boxShadowCardLight)',
                                }}
                                key={element.f_val_idx}
                            >
                                <div className='flex flex-row items-center justify-between'>
                                    <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>
                                        Validator
                                    </p>
                                    <LinkValidator validator={element.f_val_idx} mxAuto />
                                </div>

                                <div className='flex flex-row items-center justify-between'>
                                    <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>
                                        Address
                                    </p>
                                    <p>{getShortAddress(element?.f_address)}</p>
                                </div>

                                <div className='flex flex-row items-center justify-between'>
                                    <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>
                                        Amount
                                    </p>
                                    <p>{(element.f_amount / 10 ** 9).toLocaleString()} ETH</p>
                                </div>
                            </div>
                        ))}
                        {withdrawals.length == 0 && (
                            <div
                                className='flex mt-2 justify-center rounded-md border-2 border-white px-4 py-4 text-[var(--black)] dark:text-[var(--white)] bg-[var(--bgMainLightMode)] dark:bg-[var(--bgDarkMode)]'
                                style={{
                                    boxShadow: themeMode?.darkMode
                                        ? 'var(--boxShadowCardDark)'
                                        : 'var(--boxShadowCardLight)',
                                }}
                            >
                                <p className='uppercase text-[14px]'>No withdrawals</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    //OVERVIEW SLOT PAGE
    return (
        <Layout>
            <Head>
                <meta name='robots' property='noindex' />
            </Head>

            <TitleWithArrows type='slot' value={Number(id)} />

            {loadingBlock && (
                <div className='mt-6'>
                    <Loader />
                </div>
            )}

            {block && !loadingBlock && getInformationView()}
            {!block && !loadingBlock && <EpochAnimation notSlot />}
        </Layout>
    );
};

export default Slot;

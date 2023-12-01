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
import LinkSlot from '../../components/ui/LinkSlot';
import Arrow from '../../components/ui/Arrow';

import LinkBlock from '../../components/ui/LinkBlock';

// Types
import { BlockEL, Transaction, Withdrawal } from '../../types';

type CardProps = {
    title: string;
    text?: string;
    content?: React.ReactNode;
};

//Card style
const Card = ({ title, text, content }: CardProps) => {
    // Theme Mode Context
    const { themeMode } = React.useContext(ThemeModeContext) ?? {};
    return (
        <>
            <div className='flex flex-row items-center justify-between gap-5 md:gap-20'>
                <p
                    className='text-[14px] md:text-[16px] font-medium'
                    style={{
                        color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                    }}
                >
                    {title}:
                </p>
                <div className='flex gap-2 items-center'>
                    {text && (
                        <p
                            className='uppercase text-[14px] md:text-[16px] font-medium'
                            style={{
                                color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                            }}
                        >
                            {text}
                        </p>
                    )}

                    {content && <>{content}</>}
                </div>
            </div>
        </>
    );
};

const TransactionPage = () => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    // Next router
    const router = useRouter();
    const { network, id } = router.query;

    // Refs
    const slotRef = useRef(0);
    const existsBlockRef = useRef(true);

    // States
    const [block, setBlock] = useState<BlockEL | null>(null);
    const [existsBlock, setExistsBlock] = useState<boolean>(true);
    const [countdownText, setCountdownText] = useState<string>('');
    const [tabPageIndex, setTabPageIndex] = useState<number>(0);
    const [loadingBlock, setLoadingBlock] = useState<boolean>(true);
    const [desktopView, setDesktopView] = useState(true);
    const [blockGenesis, setBlockGenesis] = useState(0);

    // UseEffect
    useEffect(() => {
        if (id) {
            slotRef.current = Number(id);
        }

        if (network && ((id && !block) || (block && block.f_slot !== Number(id)))) {
            getBlock();
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
                axiosClient.get(`/api/blocks/${id}`, {
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

            const blockResponse: BlockEL = response.data.block;
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

    //TABS
    const getSelectedTab = () => {
        switch (tabPageIndex) {
            case 0:
                return getOverview();
        }
    };
    //TABS - Overview & withdrawals
    const getInformationView = () => {
        return <div className='flex flex-col mx-auto'>{getSelectedTab()}</div>;
    };

    //Overview tab - table
    const getOverview = () => {
        return (
            <div
                className='rounded-md mt-4 p-8 w-11/12 md:w-1/2 mx-auto border-2 border-white'
                style={{
                    backgroundColor: themeMode?.darkMode ? 'var(--bgFairDarkMode)' : 'var(--bgMainLightMode)',
                    boxShadow: themeMode?.darkMode ? 'var(--boxShadowCardDark)' : 'var(--boxShadowCardLight)',
                    color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                }}
            >
                {/* Table */}
                <div className='flex flex-col mx-auto gap-y-5 md:gap-y-8 '>
                    <Card title='Transaction hash' text={'0x6293...940248'} />
                    <Card title='Block' content={<LinkSlot slot={18671038} />} />
                    <Card title='Datetime (Local)' text={'2023/11/28 16:06:59'} />
                    <Card title='From' text={'0x1f90...76c326'} />
                    <Card title='To' text={'0x4675...b0a263'} />
                    <Card title='Value' text={'0.043926 ETH'} />
                    <Card title='Transaction fee' text={'0.0008958 ETH'} />
                    <Card title='Gas price' text={'42.660847 Gwei'} />
                    <Card title='Gas limit' text={'21000'} />
                    <Card title='Ethereum price' text={'$2062.63 / ETH'} />
                    <Card title='Input Data' text={String(block?.f_el_gas_used)} />
                </div>
            </div>
        );
    };

    //OVERVIEW BLOCK PAGE
    return (
        <Layout>
            <Head>
                <meta name='robots' property='noindex' />
            </Head>

            {/* Header */}
            <div className='flex gap-x-3 justify-center items-center mt-14 xl:mt-0 mb-5'>
                <LinkBlock block={Number(id) - 1}>
                    <Arrow direction='left' />
                </LinkBlock>

                <h1
                    className='text-center font-semibold text-[32px] md:text-[50px]'
                    style={{
                        color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                    }}
                >
                    Transaction {String('123,456')}
                </h1>

                <LinkBlock block={Number(id) + 1}>
                    <Arrow direction='right' />
                </LinkBlock>
            </div>

            {loadingBlock && (
                <div className='mt-6'>
                    <Loader />
                </div>
            )}

            {block?.f_slot && !loadingBlock && getInformationView()}
        </Layout>
    );
};

export default TransactionPage;

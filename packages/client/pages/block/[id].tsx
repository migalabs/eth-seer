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
import Transactions from '../../components/layouts/Transactions';
import Card from '../../components/ui/Card';
import TitleWithArrows from '../../components/ui/TitleWithArrows';

// Helpers
import { getShortAddress } from '../../helpers/addressHelper';

// Types
import { BlockEL, Transaction } from '../../types';

const BlockPage = () => {
    // Next router
    const router = useRouter();
    const { network, id } = router.query;

    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    // Refs
    const slotRef = useRef(0);
    const existsBlockRef = useRef(true);

    // States
    const [block, setBlock] = useState<BlockEL | null>(null);
    const [transactions, setTransactions] = useState<Array<Transaction>>([]);
    const [existsBlock, setExistsBlock] = useState(true);
    const [countdownText, setCountdownText] = useState('');
    const [tabPageIndex, setTabPageIndex] = useState(0);
    const [loadingBlock, setLoadingBlock] = useState(true);
    const [loadingTransactions, setLoadingTransactions] = useState(true);
    const [blockGenesis, setBlockGenesis] = useState(0);

    // UseEffect
    useEffect(() => {
        if (id) {
            slotRef.current = Number(id);
        }

        if (network && ((id && !block) || (block && block.f_slot !== Number(id)))) {
            getBlock();
            getTransactions();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [network, id]);

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

    // Get transactions
    const getTransactions = async () => {
        try {
            setLoadingTransactions(true);

            const response = await axiosClient.get(`/api/blocks/${id}/transactions`, {
                params: {
                    network,
                },
            });

            setTransactions(response.data.transactions);
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingTransactions(false);
        }
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

    //TABLE
    //TABS
    const getSelectedTab = () => {
        switch (tabPageIndex) {
            case 0:
                return getOverview();

            case 1:
                return (
                    <Transactions transactions={transactions} fullWidth fetchingTransactions={loadingTransactions} />
                );
        }
    };

    //TABS - Overview & withdrawals
    const getInformationView = () => (
        <div className='flex flex-col w-11/12 xl:w-10/12 mx-auto'>
            <div className={`flex flex-col sm:flex-row gap-4 ${tabPageIndex === 0 ? 'xl:w-1/2 xl:mx-auto' : ''}`}>
                <TabHeader header='Overview' isSelected={tabPageIndex === 0} onClick={() => setTabPageIndex(0)} />

                {existsBlock && (
                    <TabHeader
                        header='Transactions'
                        isSelected={tabPageIndex === 1}
                        onClick={() => setTabPageIndex(1)}
                    />
                )}
            </div>

            {getSelectedTab()}
        </div>
    );

    // Percent Gas usage / limit
    const percentGas = (a: number, b: number) => (a / b) * 100;

    // Overview Tab
    const getOverview = () => (
        <div
            className='rounded-md mt-4 p-8 w-full xl:w-1/2 mx-auto border-2 border-white text-[var(--black)] dark:text-[var(--white)] bg-[var(--bgMainLightMode)] dark:bg-[var(--bgFairDarkMode)]'
            style={{
                boxShadow: themeMode?.darkMode ? 'var(--boxShadowCardDark)' : 'var(--boxShadowCardLight)',
            }}
        >
            <div className='flex flex-col mx-auto gap-y-5 md:gap-y-8 '>
                <Card title='Block hash' text={getShortAddress(block?.f_el_block_hash)} />
                <Card title='Slot' content={<LinkSlot slot={block?.f_slot} />} />
                <Card title='Datetime (Local)' text={getTimeBlock()} />
                <Card title='Transactions' text={String(block?.f_el_transactions)} />
                <Card title='Fee recipient' text={getShortAddress(block?.f_el_fee_recp)} />
                <Card title='Size' text={`${Number(block?.f_payload_size_bytes)?.toLocaleString()} bytes`} />
                <Card
                    title='Gas used'
                    text={`${block?.f_el_gas_used?.toLocaleString()} (${percentGas(
                        block?.f_el_gas_used as number,
                        block?.f_el_gas_limit as number
                    ).toFixed(2)} %)`}
                />
                <Card title='Gas limit' text={block?.f_el_gas_limit?.toLocaleString()} />
            </div>
        </div>
    );

    //OVERVIEW BLOCK PAGE
    return (
        <Layout>
            <Head>
                <meta name='robots' property='noindex' />
            </Head>

            <TitleWithArrows type='block' value={Number(id)} />

            {loadingBlock && (
                <div className='mt-6'>
                    <Loader />
                </div>
            )}

            {block?.f_slot && !loadingBlock && getInformationView()}
        </Layout>
    );
};

export default BlockPage;

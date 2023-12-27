import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

// Axios
import axiosClient from '../../config/axios';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Components
import Layout from '../../components/layouts/Layout';
import Loader from '../../components/ui/Loader';
import LinkBlock from '../../components/ui/LinkBlock';
import TabHeader from '../../components/ui/TabHeader';
import CopyIcon from '../../components/ui/CopyIcon';
import Card from '../../components/ui/Card';

// Helpers
import { getShortAddress } from '../../helpers/addressHelper';

// Types
import { Transaction } from '../../types';

type CardProps = {
    title: string;
    text?: string;
    content?: React.ReactNode;
};

const TransactionPage = () => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    // Next router
    const router = useRouter();
    const { network, hash } = router.query;

    // States
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [tabPageIndex, setTabPageIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    // UseEffect
    useEffect(() => {
        if (network && hash && !transaction) {
            getTransaction();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [network, hash]);

    // Get Transaction
    const getTransaction = async () => {
        try {
            setLoading(true);

            const response = await axiosClient.get(`/api/transactions/${hash}`, {
                params: {
                    network,
                },
            });

            setTransaction(response.data.transaction);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    // Tabs
    const getSelectedTab = () => {
        switch (tabPageIndex) {
            case 0:
                return getOverview();

            case 1:
                return getMoreDetails();
        }
    };

    const getOverview = () => {
        return (
            <div
                className='rounded-md mt-4 p-8 border-2 border-white'
                style={{
                    backgroundColor: themeMode?.darkMode ? 'var(--bgFairDarkMode)' : 'var(--bgMainLightMode)',
                    boxShadow: themeMode?.darkMode ? 'var(--boxShadowCardDark)' : 'var(--boxShadowCardLight)',
                    color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                }}
            >
                <div className='flex flex-col gap-y-5 md:gap-y-8 '>
                    <Card
                        title='Transaction Hash'
                        content={
                            <div className='flex gap-x-2 justify-center items-center'>
                                <CopyIcon value={hash as string} />
                                <p className='text-[14px] md:text-[16px] font-medium'>
                                    {getShortAddress(hash as string).toUpperCase()}
                                </p>
                            </div>
                        }
                    />
                    <Card title='Block' content={<LinkBlock block={transaction?.f_el_block_number} />} />
                    <Card
                        title='Datetime (Local)'
                        text={new Date((transaction?.f_timestamp ?? 0) * 1000).toLocaleString('ja-JP')}
                    />
                    <Card
                        title='From'
                        content={
                            <div className='flex gap-x-2 justify-center items-center'>
                                <CopyIcon value={transaction?.f_from ?? ''} />
                                <p className='text-[14px] md:text-[16px] font-medium'>
                                    {getShortAddress(transaction?.f_from?.toUpperCase())}
                                </p>
                            </div>
                        }
                    />
                    <Card
                        title='To'
                        content={
                            <div className='flex gap-x-2 justify-center items-center'>
                                <CopyIcon value={transaction?.f_to ?? ''} />
                                <p className='text-[14px] md:text-[16px] font-medium'>
                                    {getShortAddress(transaction?.f_to?.toUpperCase())}
                                </p>
                            </div>
                        }
                    />
                    <Card title='Value' text={`${((transaction?.f_value ?? 0) / 10 ** 18).toLocaleString()} ETH`} />
                    <Card
                        title='Transaction Fee'
                        text={`${((transaction?.f_gas_fee_cap ?? 0) / 10 ** 9).toLocaleString()} GWEI`}
                    />
                    <Card
                        title='Gas Price'
                        text={`${((transaction?.f_gas_price ?? 0) / 10 ** 9).toLocaleString()} GWEI`}
                    />
                </div>
            </div>
        );
    };

    const getMoreDetails = () => {
        return (
            <div
                className='rounded-md mt-4 p-8 border-2 border-white'
                style={{
                    backgroundColor: themeMode?.darkMode ? 'var(--bgFairDarkMode)' : 'var(--bgMainLightMode)',
                    boxShadow: themeMode?.darkMode ? 'var(--boxShadowCardDark)' : 'var(--boxShadowCardLight)',
                    color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                }}
            >
                <div className='flex flex-col mx-auto gap-y-5 md:gap-y-8 '>
                    <Card title='Usage Gas' text={Number(transaction?.f_gas).toLocaleString() ?? ''} />
                    <Card title='Nonce' text={transaction?.f_nonce.toString() ?? '0'} />
                    <Card title='Txn Type' text={transaction?.f_tx_type.toString() ?? ''} />
                    <Card
                        title='Input Data'
                        content={
                            transaction?.f_data && (
                                <textarea
                                    className='flex-1 max-w-[60%] h-24 p-2 rounded-md border-2 border-white text-black text-[14px]'
                                    value={transaction?.f_data}
                                />
                            )
                        }
                    />
                </div>
            </div>
        );
    };

    return (
        <Layout>
            <Head>
                <meta name='robots' property='noindex' />
            </Head>

            <h1
                className='text-center font-medium text-[32px] md:text-[50px] mt-14 xl:mt-0 mb-5'
                style={{
                    color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                }}
            >
                Transaction
            </h1>

            {loading && (
                <div className='mt-6'>
                    <Loader />
                </div>
            )}

            {transaction && (
                <div className='flex flex-col w-11/12 md:w-1/2 mx-auto'>
                    <div className='flex flex-col sm:flex-row gap-4'>
                        <TabHeader
                            header='Overview'
                            isSelected={tabPageIndex === 0}
                            onClick={() => setTabPageIndex(0)}
                        />
                        <TabHeader
                            header='More Details'
                            isSelected={tabPageIndex === 1}
                            onClick={() => setTabPageIndex(1)}
                        />
                    </div>

                    {getSelectedTab()}
                </div>
            )}
        </Layout>
    );
};

export default TransactionPage;

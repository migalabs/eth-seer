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

// Helpers
import { getShortAddress } from '../../helpers/addressHelper';

// Types
import { Transaction } from '../../types';

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
    );
};

const TransactionPage = () => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    // Next router
    const router = useRouter();
    const { network, hash } = router.query;

    // States
    const [transaction, setTransaction] = useState<Transaction | null>(null);
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

    const getInformationView = () => {
        return <div className='flex flex-col mx-auto'>{getOverview()}</div>;
    };

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
                <div className='flex flex-col mx-auto gap-y-5 md:gap-y-8 '>
                    <Card title='Transaction Hash' text={getShortAddress(hash as string)} />
                    <Card title='Block' content={<LinkBlock block={transaction?.f_el_block_number} />} />
                    <Card
                        title='Datetime (Local)'
                        text={new Date((transaction?.f_timestamp ?? 0) * 1000).toLocaleString('ja-JP')}
                    />
                    <Card title='From' text={getShortAddress(transaction?.f_from)} />
                    <Card title='To' text={getShortAddress(transaction?.f_to)} />
                    <Card title='Value' text={`${((transaction?.f_value ?? 0) / 10 ** 18).toLocaleString()} ETH`} />
                    <Card
                        title='Transaction Fee'
                        text={`${((transaction?.f_gas_fee_cap ?? 0) / 10 ** 12).toLocaleString()} GWEI`}
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

            {transaction && getInformationView()}
        </Layout>
    );
};

export default TransactionPage;

import React, { useState, useEffect, useContext } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

// Axios
import axiosClient from '../config/axios';

// Contexts
import ThemeModeContext from '../contexts/theme-mode/ThemeModeContext';

// Components
import Layout from '../components/layouts/Layout';
import ViewMoreButton from '../components/ui/ViewMoreButton';
import TransactionsComponent from '../components/layouts/Transactions';

// Types
import { Transaction } from '../types';

const Transactions = () => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    // Router
    const router = useRouter();
    const { network } = router.query;

    // States
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(false);

    // UseEffect
    useEffect(() => {
        if (network && transactions.length === 0) {
            getTransactions(0);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [network]);

    //TRANSACTIONS TABLE
    const getTransactions = async (page: number) => {
        try {
            setLoading(true);
            setCurrentPage(page);

            const response = await axiosClient.get('/api/transactions', {
                params: {
                    network,
                    page,
                    limit: 20,
                    threshold: transactions.length > 0 ? transactions[transactions.length - 1].f_tx_idx : null,
                },
            });

            setTransactions(prevState => [
                ...prevState,
                ...response.data.transactions.filter(
                    (transaction: Transaction) =>
                        !prevState.find(
                            (prevTransaction: Transaction) => prevTransaction.f_tx_idx === transaction.f_tx_idx
                        )
                ),
            ]);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    //Overview Transaction page
    return (
        <Layout hideMetaDescription>
            <Head>
                <title>Transactions of the Ethereum Chain - EthSeer.io</title>
                <meta
                    name='description'
                    content='You can find all Ethereum transactions here, with their source, target, value transferred and cost.'
                />
                <meta name='keywords' content='Ethereum, Transactions, Execution Layer, Blocks, EVM' />
                <link rel='canonical' href='https://ethseer.io/transactions' />
            </Head>

            <h1
                className='text-center font-semibold text-[32px] md:text-[50px] mt-10 xl:mt-0 capitalize'
                style={{
                    color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                }}
            >
                Ethereum Transactions
            </h1>

            <div
                className='mx-auto md:my-0 my-2 py-4 px-6 border-2 border-[var(--purple)] rounded-md flex w-11/12 lg:w-10/12'
                style={{ background: themeMode?.darkMode ? 'var(--bgDarkMode)' : 'var(--bgMainLightMode)' }}
            >
                <h2
                    className='text-[14px] 2xl:text-[18px] mx-auto text-center leading-5'
                    style={{
                        color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                    }}
                >
                    Transactions are the atomic components that create the state of the Ethereum Virtual Machine.
                </h2>
            </div>

            <div className='mb-6'>
                <TransactionsComponent loadingTransactions={loading} transactions={transactions} />
            </div>

            <ViewMoreButton onClick={() => getTransactions(currentPage + 1)} />
        </Layout>
    );
};

export default Transactions;

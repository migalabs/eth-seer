import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

// Axios
import axiosClient from '../config/axios';

// Components
import Layout from '../components/layouts/Layout';
import TransactionList from '../components/layouts/Transactions';
import Loader from '../components/ui/Loader';
import Pagination from '../components/ui/Pagination';

// Types
import { Transaction } from '../types';

const Transactions = () => {
    // Constants
    const LIMIT = 10;

    // Router
    const router = useRouter();
    const { network } = router.query;

    // States
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [firstQueryFetched, setFirstQueryFetched] = useState(false);

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
                    limit: LIMIT,
                },
            });

            setTransactions(response.data.transactions);
            setFirstQueryFetched(true);
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

            <h1 className='text-center font-semibold text-[32px] md:text-[50px] mt-10 xl:mt-0 capitalize text-[var(--black)] dark:text-[var(--white)]'>
                Ethereum Transactions
            </h1>

            <div className='mx-auto md:my-0 my-2 py-4 px-6 border-2 border-[var(--purple)] rounded-md flex w-11/12 lg:w-10/12 bg-[var(--bgMainLightMode)] dark:bg-[var(--bgDarkMode)]'>
                <h2 className='text-[14px] 2xl:text-[18px] mx-auto text-center leading-5 text-[var(--black)] dark:text-[var(--white)]'>
                    Transactions are the atomic components that create the state of the Ethereum Virtual Machine.
                </h2>
            </div>

            {firstQueryFetched && (
                <Pagination currentPage={currentPage} totalPages={5000} onChangePage={getTransactions} />
            )}

            {loading ? (
                <div className='my-6'>
                    <Loader />
                </div>
            ) : (
                <TransactionList loadingTransactions={loading} transactions={transactions} />
            )}
        </Layout>
    );
};

export default Transactions;

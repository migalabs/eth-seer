import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

// Axios
import axiosClient from '../config/axios';

// Components
import Layout from '../components/layouts/Layout';
import TransactionList from '../components/layouts/Transactions';
import Pagination from '../components/ui/Pagination';
import Title from '../components/ui/Title';
import PageDescription from '../components/ui/PageDescription';

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

    useEffect(() => {
        if (network && transactions.length === 0) {
            getTransactions(0);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [network]);

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

            <Title>Ethereum Transactions</Title>

            <PageDescription>
                Transactions are the atomic components that create the state of the Ethereum Virtual Machine.
            </PageDescription>

            {firstQueryFetched && (
                <Pagination currentPage={currentPage} totalPages={10000} onChangePage={getTransactions} />
            )}

            <TransactionList transactions={transactions} fetchingTransactions={loading} />
        </Layout>
    );
};

export default Transactions;

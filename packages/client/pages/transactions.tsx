import React, { useState, useEffect } from 'react';
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
    const MAX_TRANSACTIONS = 100000;

    // Router
    const router = useRouter();
    const { network } = router.query;

    // States
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [firstQueryFetched, setFirstQueryFetched] = useState(false);
    const [numRowsQuery, setNumRowsQuery] = useState(0);

    useEffect(() => {
        if (network && transactions.length === 0) {
            getTransactions(0, 10);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [network]);

    const getTransactions = async (page: number, limit: number) => {
        try {
            setLoading(true);
            setCurrentPage(page);
            setNumRowsQuery(limit);

            const response = await axiosClient.get('/api/transactions', {
                params: {
                    network,
                    page,
                    limit,
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
        <Layout
            title='Transactions of the Ethereum Chain - EthSeer.io'
            description='You can find all Ethereum transactions here, with their source, target, value transferred and cost.'
            keywords='Ethereum, Transactions, Execution Layer, Blocks, EVM'
            canonical='https://ethseer.io/transactions'
        >
            <Title>Ethereum Transactions</Title>

            <PageDescription>
                Transactions are the atomic components that create the state of the Ethereum Virtual Machine.
            </PageDescription>

            {firstQueryFetched && transactions.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={MAX_TRANSACTIONS / numRowsQuery}
                    onChangePage={page => getTransactions(page, numRowsQuery)}
                    onChangeNumRows={numRows => getTransactions(0, numRows)}
                />
            )}

            <TransactionList transactions={transactions} fetchingTransactions={loading} />
        </Layout>
    );
};

export default Transactions;

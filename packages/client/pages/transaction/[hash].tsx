import React, { useEffect, useState, useContext, useRef } from 'react';
import { GetServerSideProps } from 'next';
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
import Card from '../../components/ui/Card';
import Title from '../../components/ui/Title';
import AddressCopy from '../../components/ui/AddressCopy';
import InfoBox from '../../components/layouts/InfoBox';
import ShareMenu from '../../components/ui/ShareMenu';

// Types
import { Transaction } from '../../types';

// Props
interface Props {
    hash: string;
    network: string;
}

// Server Side Props
export const getServerSideProps: GetServerSideProps = async context => {
    const hash = context.params?.hash;
    const network = context.query?.network;

    if (!hash || !network) {
        return {
            notFound: true,
        };
    }

    return { props: { hash, network } };
};

const TransactionPage = ({ hash, network }: Props) => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    // Refs
    const hashRef = useRef('');

    // States
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [tabPageIndex, setTabPageIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    // UseEffect
    useEffect(() => {
        if (!transaction || hashRef.current !== hash) {
            hashRef.current = hash;
            getTransaction();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hash]);

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

    const getOverview = () => {
        return (
            <div
                className='rounded-md mt-4 p-8 border-2 border-white text-[var(--black)] dark:text-[var(--white)] bg-[var(--bgMainLightMode)] dark:bg-[var(--bgFairDarkMode)]'
                style={{
                    boxShadow: themeMode?.darkMode ? 'var(--boxShadowCardDark)' : 'var(--boxShadowCardLight)',
                }}
            >
                <div className='flex flex-col gap-y-4'>
                    <Card title='Transaction Hash' content={<AddressCopy address={hash} />} />
                    <Card title='Block' content={<LinkBlock block={transaction?.f_el_block_number} />} />
                    <Card
                        title='Time (Local)'
                        text={new Date((transaction?.f_timestamp ?? 0) * 1000).toLocaleString('ja-JP')}
                    />
                    <Card title='From' content={<AddressCopy address={transaction?.f_from} />} />
                    <Card title='To' content={<AddressCopy address={transaction?.f_to} />} />
                    <Card title='Value' text={`${((transaction?.f_value ?? 0) / 10 ** 18).toLocaleString()} ETH`} />
                    <Card
                        title='Transaction Fee'
                        text={`${((transaction?.f_gas_fee_cap ?? 0) / 10 ** 9).toLocaleString()} GWEI`}
                    />
                    <Card
                        title='Gas Price'
                        text={`${((transaction?.f_gas_price ?? 0) / 10 ** 9).toLocaleString()} GWEI`}
                    />
                    <details>
                        <summary className="text-lg text-purple-400 cursor-pointer hover:text-purple-600">More Details</summary>
                        <div className="flex flex-col gap-y-5 md:gap-y-8 mt-8">
                            <Card title='Usage Gas' text={Number(transaction?.f_gas).toLocaleString() ?? ''} />
                            <Card title='Nonce' text={transaction?.f_nonce.toString() ?? '0'} />
                            <Card title='Txn Type' text={transaction?.f_tx_type.toString() ?? ''} />
                            <Card
                                title='Input Data'
                                content={
                                    transaction?.f_data && (
                                        <textarea
                                            className='flex-1 max-w-[60%] h-24 p-2 rounded-md border-2 border-white text-black text-[14px] font-normal'
                                            value={transaction?.f_data}
                                            readOnly
                                        />
                                    )
                                }
                            />
                        </div>
                    </details>
                </div>
            </div>
        );
    };

    return (
        <Layout
            title='Transaction Details - Ethereum | EthSeer.io'
            description='Examine the Ethereum transaction details, including sender, receiver, value, and gas fees. Explore comprehensive transaction analytics with EthSeer.io.'
        >
            <Head>
                <meta name='robots' property='noindex' />
            </Head>

            <Title>Transaction</Title>

            {loading && (
                <div className='mt-6'>
                    <Loader />
                </div>
            )}

            {transaction && (
                <div className='flex flex-col w-11/12 md:w-1/2 mx-auto'>
                    <div className='flex flex-col sm:flex-row justify-between items-end w-full gap-4'>
                        <div className='flex flex-col sm:flex-row gap-4 w-full'>
                            <TabHeader
                                header='Overview'
                                isSelected={tabPageIndex === 0}
                                onClick={() => setTabPageIndex(0)}
                            />
                        </div>

                        <ShareMenu type='transaction' />
                    </div>

                    {getOverview()}
                </div>
            )}

            {!loading && !transaction && <InfoBox text="Transaction doesn't exist yet" />}
        </Layout>
    );
};

export default TransactionPage;

import React, { useState, useEffect, useContext, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

// Axios
import axiosClient from '../config/axios';

// Contexts
import ThemeModeContext from '../contexts/theme-mode/ThemeModeContext';

// Components
import Layout from '../components/layouts/Layout';
import Loader from '../components/ui/Loader';
import ViewMoreButton from '../components/ui/ViewMoreButton';

// Types
import { Transaction } from '../types';

const Transactions = () => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    // Router
    const router = useRouter();
    const { network } = router.query;

    // Refs
    const containerRef = useRef<HTMLInputElement>(null);

    // States
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [desktopView, setDesktopView] = useState(true);

    // UseEffect
    useEffect(() => {
        if (network && transactions.length === 0) {
            getTransactions(0);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [network]);

    useEffect(() => {
        setDesktopView(window !== undefined && window.innerWidth > 768);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    //TRANSACTIONS TABLE
    const getTransactions = async (page: number) => {
        try {
            setLoading(true);
            setCurrentPage(page);

            const response = await axiosClient.get('/api/transactions', {
                params: {
                    network,
                    page,
                    limit: 1,
                },
            });

            setTransactions(prevState => [
                ...prevState,
                ...response.data.transactions.filter(
                    (transaction: Transaction) =>
                        !prevState.find((prevTransaction: Transaction) => prevTransaction.f_hash === transaction.f_hash)
                ),
            ]);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    // Get Short Address
    const getShortAddress = (address: string | undefined) => {
        if (typeof address === 'string') {
            return `${address.slice(0, 6)}...${address.slice(address.length - 6, address.length)}`;
        } else {
            return 'Invalid Address';
        }
    };

    const getAge = (timestamp: number) => {
        // Calculate the difference in milliseconds
        const difference = Date.now() - new Date(timestamp * 1000).getTime();

        // Convert to a readable timespan
        const seconds = Math.floor((difference / 1000) % 60);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);

        const parts = [];

        if (hours > 0) {
            parts.push(`${hours}h`);
        }

        parts.push(`${minutes}m`);

        if (hours == 0) {
            parts.push(`${seconds}s`);
        }

        return parts.join(' ');
    };

    //View table desktop
    const getTransactionsDesktop = () => {
        return (
            <div
                ref={containerRef}
                className='flex flex-col mb-4 px-6 overflow-x-scroll overflow-y-hidden scrollbar-thin text-center sm:items-center'
                onMouseMove={handleMouseMove}
            >
                <div
                    className='font-semibold flex gap-x-1 justify-around px-2 xl:px-8 py-3 text-[14px] md:text-[16px] min-w-[800px]'
                    style={{
                        color: themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)',
                    }}
                >
                    <p className='w-3/5'>Txn Hash</p>
                    <p className='w-3/5'>Age</p>
                    <p className='w-3/5'>From</p>
                    <p className='w-3/5'>To</p>
                    <p className='w-3/5'>Value</p>
                    <p className='w-3/5'>Txn Fee</p>
                </div>

                <div
                    className='flex flex-col justify-center gap-y-4 rounded-md border-2 border-white py-5 px-2 xl:px-8 min-w-[800px]'
                    style={{
                        backgroundColor: themeMode?.darkMode ? 'var(--bgFairDarkMode)' : 'var(--bgMainLightMode)',
                        boxShadow: themeMode?.darkMode ? 'var(--boxShadowCardDark)' : 'var(--boxShadowCardLight)',
                        color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                    }}
                >
                    {transactions.map((transaction: Transaction) => (
                        <div
                            key={transaction.f_hash}
                            className='font-medium flex gap-x-1 justify-around items-center text-[14px] md:text-[16px]'
                            style={{
                                color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                            }}
                        >
                            <p className='w-3/5'>{getShortAddress(transaction.f_hash)}</p>

                            <p className='w-3/5'>{getAge(transaction.f_timestamp)}</p>

                            <p className='w-3/5'>{getShortAddress(transaction.f_from)}</p>

                            <p className='w-3/5'>{getShortAddress(transaction.f_to)}</p>

                            <p className='w-3/5'>{(transaction.f_value / 10 ** 18).toLocaleString()} ETH</p>

                            <p className='w-3/5'>{(transaction.f_gas_fee_cap / 10 ** 12).toLocaleString()} GWEI</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    //View table mobile
    const getTransactionsMobile = () => {
        return (
            <div
                ref={containerRef}
                className='mt-4 flex flex-col gap-2 font-medium text-[14px] w-11/12 mx-auto'
                onMouseMove={handleMouseMove}
                style={{
                    color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                }}
            >
                {transactions.map((transaction: Transaction) => (
                    <div
                        key={transaction.f_hash}
                        className='flex flex-col gap-y-2 py-4 px-14 border-2 border-white rounded-md'
                        style={{
                            backgroundColor: themeMode?.darkMode ? 'var(--bgFairDarkMode)' : 'var(--bgMainLightMode)',
                            boxShadow: themeMode?.darkMode ? 'var(--boxShadowCardDark)' : 'var(--boxShadowCardLight)',
                            color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                        }}
                    >
                        <div className='flex flex-row items-center justify-between'>
                            <p
                                className='font-semibold'
                                style={{
                                    color: themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)',
                                }}
                            >
                                Txn Hash
                            </p>
                            <p>{getShortAddress(transaction.f_hash)}</p>
                        </div>

                        <div className='flex flex-row items-center justify-between'>
                            <p
                                className='font-semibold'
                                style={{
                                    color: themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)',
                                }}
                            >
                                Age
                            </p>
                            <p>{transaction.f_timestamp}</p>
                        </div>

                        <div className='flex flex-row items-center justify-between uppercase'>
                            <p
                                className='capitalize font-semibold'
                                style={{
                                    color: themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)',
                                }}
                            >
                                From
                            </p>
                            <p>{getShortAddress(transaction.f_from)}</p>
                        </div>

                        <div className='flex flex-row items-center justify-between'>
                            <p
                                className='font-semibold'
                                style={{
                                    color: themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)',
                                }}
                            >
                                To
                            </p>
                            <p>{getShortAddress(transaction.f_to)}</p>
                        </div>

                        <div className='flex flex-row items-center justify-between'>
                            <p
                                className='font-semibold'
                                style={{
                                    color: themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)',
                                }}
                            >
                                Value
                            </p>
                            <p>{(transaction.f_value / 10 ** 18).toLocaleString()} ETH</p>
                        </div>

                        <div className='flex flex-row items-center justify-between'>
                            <p
                                className='font-semibold'
                                style={{
                                    color: themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)',
                                }}
                            >
                                Txn Fee
                            </p>
                            <p>{(transaction.f_gas_fee_cap / 10 ** 12).toLocaleString()} GWEI</p>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    //OVERVIEW PAGE
    //Overview Transaction page
    return (
        <Layout hideMetaDescription>
            <Head>
                <title>Transactions of the Ethereum Beacon Chain - EthSeer.io</title>
                <meta name='description' content='Check the Ethereum chain transactions.' />
                <meta
                    name='keywords'
                    content='Ethereum, Epochs, Timeframes, Security, Validators, Consensus, Transactions'
                />
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
                    Transactions in Ethereum refer to a specific period of time in the Beacon Chain.
                </h2>
            </div>

            <div>{desktopView ? getTransactionsDesktop() : getTransactionsMobile()}</div>

            {loading && (
                <div className='mb-4'>
                    <Loader />
                </div>
            )}

            <ViewMoreButton onClick={() => getTransactions(currentPage + 1)} />
        </Layout>
    );
};

export default Transactions;

import React, { useEffect, useState, useRef, useContext } from 'react';
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
import Transactions from '../../components/layouts/Transactions';
import EpochAnimation from '../../components/layouts/EpochAnimation';

// Types
import { BlockEL, Transaction } from '../../types';

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

const BlockPage = () => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    // Next router
    const router = useRouter();
    const { network, id } = router.query;

    // Refs
    const blockRef = useRef(0);

    // States
    const [block, setBlock] = useState<BlockEL | null>(null);
    const [transactions, setTransactions] = useState<Array<Transaction>>([]);
    const [tabPageIndex, setTabPageIndex] = useState(0);
    const [loadingBlock, setLoadingBlock] = useState(true);
    const [loadingTransactions, setLoadingTransactions] = useState(true);
    const [notBlock, setNotBlock] = useState(false);

    // UseEffect
    useEffect(() => {
        if (id) {
            blockRef.current = Number(id);
        }

        if (network && ((id && !block) || (block && block.f_el_block_number !== Number(id)))) {
            getBlock();
            getTransactions();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [network, id]);

    // Get blocks
    const getBlock = async () => {
        try {
            setLoadingBlock(true);

            const [blockResponse, latestBlockResponse] = await Promise.all([
                axiosClient.get(`/api/blocks/${id}`, {
                    params: {
                        network,
                    },
                }),
                axiosClient.get('/api/blocks/latest', {
                    params: {
                        network,
                    },
                }),
            ]);

            setBlock(blockResponse.data.block);
            setNotBlock(Number(id) < latestBlockResponse.data.block.f_el_block_number);
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

    // Get Short Address
    const getShortAddress = (address: string | undefined) => {
        if (typeof address === 'string') {
            return `${address.slice(0, 6)}...${address.slice(address.length - 6, address.length)}`;
        } else {
            return 'Invalid Address';
        }
    };

    //TABLE
    //TABS
    const getSelectedTab = () => {
        switch (tabPageIndex) {
            case 0:
                return getOverview();

            case 1:
                return <Transactions transactions={transactions} loadingTransactions={loadingTransactions} />;
        }
    };
    //TABS - Overview & withdrawals
    const getInformationView = () => {
        return (
            <div className='flex flex-col mx-auto'>
                <div className='flex flex-col sm:flex-row gap-4 w-1/2 mx-auto'>
                    <TabHeader header='Overview' isSelected={tabPageIndex === 0} onClick={() => setTabPageIndex(0)} />
                    <TabHeader
                        header='Transactions'
                        isSelected={tabPageIndex === 1}
                        onClick={() => setTabPageIndex(1)}
                    />
                </div>

                {getSelectedTab()}
            </div>
        );
    };

    //%Gas usage / limit
    const percentGas = (a: number, b: number) => {
        return (a / b) * 100;
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
                    <Card title='Block hash' text={getShortAddress(block?.f_el_block_hash)} />
                    <Card title='Slot' content={<LinkSlot slot={block?.f_slot} />} />
                    <Card
                        title='Datetime (Local)'
                        text={new Date((block?.f_timestamp ?? 0) * 1000).toLocaleString('ja-JP')}
                    />
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
                    Block {Number(id)?.toLocaleString()}
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

            {block && !loadingBlock && getInformationView()}
            {!block && !loadingBlock && <EpochAnimation notBlock={notBlock} />}
        </Layout>
    );
};

export default BlockPage;

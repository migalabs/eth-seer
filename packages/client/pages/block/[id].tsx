import React, { useEffect, useState, useRef, useContext } from 'react';
import { GetServerSideProps } from 'next';
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
import InfoBox from '../../components/layouts/InfoBox';
import AddressCopy from '../../components/ui/AddressCopy';
import ShareMenu from '../../components/ui/ShareMenu';

// Types
import { BlockEL, Transaction } from '../../types';

// Props
interface Props {
    id: number;
    network: string;
}

// Server Side Props
export const getServerSideProps: GetServerSideProps = async context => {
    const id = context.params?.id;
    const network = context.query?.network;

    if (isNaN(Number(id)) || !network) {
        return {
            notFound: true,
        };
    }

    return { props: { id: Number(id), network } };
};

const BlockPage = ({ id, network }: Props) => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    // Refs
    const idRef = useRef(0);

    // States
    const [block, setBlock] = useState<BlockEL | null>(null);
    const [transactions, setTransactions] = useState<Array<Transaction>>([]);
    const [tabPageIndex, setTabPageIndex] = useState(0);
    const [loadingBlock, setLoadingBlock] = useState(true);
    const [loadingTransactions, setLoadingTransactions] = useState(true);
    const [infoBoxText, setInfoBoxText] = useState('');

    // UseEffect
    useEffect(() => {
        if (!block || idRef.current !== id) {
            idRef.current = id;
            getBlock();
            getTransactions();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

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

            if (blockResponse.data.block) {
                setInfoBoxText('');
            } else if (id < latestBlockResponse.data.block.f_el_block_number) {
                setInfoBoxText('Block not saved yet');
            } else {
                setInfoBoxText("We're not there yet");
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

    //TABLE
    //TABS
    const getSelectedTab = () => {
        switch (tabPageIndex) {
            case 0:
                return getOverview();

            case 1:
                return <Transactions transactions={transactions} fetchingTransactions={loadingTransactions} />;
        }
    };

    //TABS - Overview & withdrawals
    const getInformationView = () => {
        return (
            <div className='flex flex-col mx-auto'>
                <div className='flex flex-col sm:flex-row justify-between items-end gap-4 w-11/12 xl:w-1/2 mx-auto'>
                    <div className='flex flex-col sm:flex-row gap-4 w-full'>
                        <TabHeader
                            header='Overview'
                            isSelected={tabPageIndex === 0}
                            onClick={() => setTabPageIndex(0)}
                        />
                        <TabHeader
                            header='Transactions'
                            isSelected={tabPageIndex === 1}
                            onClick={() => setTabPageIndex(1)}
                        />
                    </div>

                    <ShareMenu type='block' />
                </div>

                {getSelectedTab()}
            </div>
        );
    };

    // Percent Gas usage / limit
    const percentGas = (a: number, b: number) => (a / b) * 100;

    // Overview Tab
    const getOverview = () => (
        <div
            className='rounded-md mt-4 p-8 w-11/12 xl:w-1/2 mx-auto border-2 border-white text-[var(--black)] dark:text-[var(--white)] bg-[var(--bgMainLightMode)] dark:bg-[var(--bgFairDarkMode)]'
            style={{
                boxShadow: themeMode?.darkMode ? 'var(--boxShadowCardDark)' : 'var(--boxShadowCardLight)',
            }}
        >
            <div className='flex flex-col mx-auto gap-y-5 md:gap-y-8 '>
                <Card title='Block hash' content={<AddressCopy address={block?.f_el_block_hash} />} />
                <Card title='Slot' content={<LinkSlot slot={block?.f_slot} />} />
                <Card title='Time (Local)' text={new Date((block?.f_timestamp ?? 0) * 1000).toLocaleString('ja-JP')} />
                <Card title='Transactions' text={String(block?.f_el_transactions)} />
                <Card title='Fee recipient' content={<AddressCopy address={block?.f_el_fee_recp} />} />
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
        <Layout
            title={`Block ${id} Analysis - Ethereum Blockchain | EthSeer.io`}
            description={`Detailed insights into Block ${id} on the Ethereum blockchain, including transactions, gas used, and proposer. Understand block dynamics with EthSeer.io.`}
        >
            <Head>
                <meta name='robots' property='noindex' />
            </Head>

            <TitleWithArrows type='block' value={id} />

            {loadingBlock && (
                <div className='mt-6'>
                    <Loader />
                </div>
            )}

            {block && !loadingBlock && getInformationView()}
            {!block && !loadingBlock && <InfoBox text={infoBoxText} />}
        </Layout>
    );
};

export default BlockPage;

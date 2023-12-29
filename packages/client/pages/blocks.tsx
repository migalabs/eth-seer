import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

// Axios
import axiosClient from '../config/axios';

// Components
import Layout from '../components/layouts/Layout';
import BlockList from '../components/layouts/Blocks';
import Loader from '../components/ui/Loader';
import Pagination from '../components/ui/Pagination';
import Title from '../components/ui/Title';
import PageDescription from '../components/ui/PageDescription';

// Types
import { BlockEL } from '../types';

const Blocks = () => {
    // Constants
    const LIMIT = 32;

    // Router
    const router = useRouter();
    const { network } = router.query;

    // States
    const [blocks, setBlocks] = useState<BlockEL[]>([]);
    const [blocksCount, setBlocksCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (network && blocks.length === 0) {
            getBlocks(0);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [network]);

    const getBlocks = async (page: number) => {
        try {
            setLoading(true);

            setCurrentPage(page);

            const response = await axiosClient.get(`/api/blocks`, {
                params: {
                    network,
                    page,
                    limit: LIMIT,
                },
            });

            setBlocks(response.data.blocks);
            setBlocksCount(response.data.totalCount);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout hideMetaDescription>
            <Head>
                <title>Blocks of the Ethereum Chain - EthSeer.io</title>
                <meta
                    name='description'
                    content='Check the Ethereum chain blocks to find the gas used, gas price, number of transactions, transaction details and withdrawals of the block.'
                />
                <meta name='keywords' content='Ethereum, Slot, State, Block, Validators, Slashing, Attestations' />
                <link rel='canonical' href='https://ethseer.io/blocks' />
            </Head>

            <Title>Ethereum Blocks</Title>

            <PageDescription>
                Blocks are the fundamental unit of consensus for blockchains. In it you will find a number of
                transactions and interactions with smart contracts.
            </PageDescription>

            {blocksCount > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(blocksCount / LIMIT)}
                    onChangePage={getBlocks}
                />
            )}

            {loading ? (
                <div className='my-6'>
                    <Loader />
                </div>
            ) : (
                <BlockList blocks={blocks} />
            )}
        </Layout>
    );
};

export default Blocks;

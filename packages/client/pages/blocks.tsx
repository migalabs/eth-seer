import React, { useState, useEffect, useContext } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

// Contexts
import ThemeModeContext from '../contexts/theme-mode/ThemeModeContext';

// Axios
import axiosClient from '../config/axios';

// Components
import Layout from '../components/layouts/Layout';
import BlocksLayout from '../components/layouts/BlocksLayout';
import Loader from '../components/ui/Loader';
import ViewMoreButton from '../components/ui/ViewMoreButton';

// Types
import { BlockEL } from '../types';

const Blocks = () => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    // Router
    const router = useRouter();
    const { network } = router.query;

    // States
    const [blocks, setBlocks] = useState<BlockEL[]>([]);
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
                    limit: 32,
                },
            });

            setBlocks(prevState => [
                ...prevState,
                ...response.data.blocks.filter(
                    (block: BlockEL) => !prevState.find((prevBlock: BlockEL) => prevBlock.f_slot === block.f_slot)
                ),
            ]);
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

            <h1
                className='text-center mt-10 xl:mt-0 font-semibold text-[32px] md:text-[50px] capitalize'
                style={{
                    color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                }}
            >
                Ethereum Blocks
            </h1>

            <div
                className='mx-auto py-4 px-6 border-2 border-[var(--purple)] rounded-md flex w-11/12 lg:w-10/12'
                style={{ background: themeMode?.darkMode ? 'var(--bgDarkMode)' : 'var(--bgMainLightMode)' }}
            >
                <h2
                    className='text-white text-[14px] 2xl:text-[18px] text-center leading-5'
                    style={{
                        color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                    }}
                >
                    Blocks are the fundamental unit of consensus for blockchains. In it you will find a number of
                    transactions and interactions with smart contracts.
                </h2>
            </div>

            <div className='mx-auto w-11/12 md:w-10/12 my-4'>
                {blocks.length > 0 && <BlocksLayout blocks={blocks} />}
            </div>

            {loading && (
                <div className='my-6'>
                    <Loader />
                </div>
            )}

            {blocks.length > 0 && <ViewMoreButton onClick={() => getBlocks(currentPage + 1)} />}
        </Layout>
    );
};

export default Blocks;
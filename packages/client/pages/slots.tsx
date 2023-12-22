import React, { useState, useEffect, useContext } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

// Axios
import axiosClient from '../config/axios';

// Contexts
import ThemeModeContext from '../contexts/theme-mode/ThemeModeContext';

// Components
import Layout from '../components/layouts/Layout';
import SlotsList from '../components/layouts/Slots';
import Loader from '../components/ui/Loader';
import Pagination from '../components/ui/Pagination';

// Types
import { Slot } from '../types';

const Slots = () => {
    // Constants
    const LIMIT = 32;

    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    // Router
    const router = useRouter();
    const { network } = router.query;

    // States
    const [slots, setSlots] = useState<Slot[]>([]);
    const [slotsCount, setSlotsCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (network && slots.length === 0) {
            getSlots(0);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [network]);

    const getSlots = async (page: number) => {
        try {
            setLoading(true);

            setCurrentPage(page);

            const response = await axiosClient.get(`/api/slots`, {
                params: {
                    network,
                    page,
                    limit: LIMIT,
                },
            });

            setSlots(response.data.slots);
            setSlotsCount(response.data.totalCount);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout hideMetaDescription>
            <Head>
                <title>Slots of the Ethereum Beacon Chain - EthSeer.io</title>
                <meta
                    name='description'
                    content='Check the Ethereum chain slots, to find the block proposer, the number of attestations, the gas used, number of transactions and withdrawals.'
                />
                <meta name='keywords' content='Ethereum, Slots, State, Block, Validator, Proposer, Attestations' />
                <link rel='canonical' href='https://ethseer.io/slots' />
            </Head>

            <h1
                className='text-center mt-10 xl:mt-0 font-semibold text-[32px] md:text-[50px] capitalize'
                style={{
                    color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                }}
            >
                Ethereum Slots
            </h1>

            <div
                className='mx-auto py-4 px-6 border-2 border-[var(--purple)] rounded-md flex w-11/12 lg:w-10/12'
                style={{ background: themeMode?.darkMode ? 'var(--bgDarkMode)' : 'var(--bgMainLightMode)' }}
            >
                <h2
                    className='text-white text-[14px] 2xl:text-[18px] text-center leading-6'
                    style={{
                        color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                    }}
                >
                    Every epoch is divided into regular interval called slots, which occur every 12 seconds. At every
                    slot, one validator can propose a block, and the other validators need to attest on the canonical
                    chain.
                </h2>
            </div>

            {slotsCount > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(slotsCount / LIMIT)}
                    onChangePage={getSlots}
                />
            )}

            {loading ? (
                <div className='my-6'>
                    <Loader />
                </div>
            ) : (
                <SlotsList slots={slots} />
            )}
        </Layout>
    );
};

export default Slots;

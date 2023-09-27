import React, { useState, useEffect, useContext } from 'react';
import Head from 'next/head';

// Contexts
import ThemeModeContext from '.././contexts/theme-mode/ThemeModeContext';

// Axios
import axiosClient from '../config/axios';

// Components
import Layout from '../components/layouts/Layout';
import SlotsList from '../components/layouts/Slots';
import Loader from '../components/ui/Loader';
import ViewMoreButton from '../components/ui/ViewMoreButton';

// Types
import { Slot } from '../types';

const Slots = () => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    // States
    const [slots, setSlots] = useState<Slot[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (slots.length === 0) {
            getSlots(0);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getSlots = async (page: number) => {
        try {
            setLoading(true);

            setCurrentPage(page);

            const response = await axiosClient.get(`/api/slots`, {
                params: {
                    page,
                    limit: 32,
                },
            });

            setSlots(prevState => [
                ...prevState,
                ...response.data.slots.filter(
                    (slot: Slot) =>
                        !prevState.find((prevSlot: Slot) => prevSlot.f_proposer_slot === slot.f_proposer_slot)
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
                <title>Slots of the Ethereum Beacon Chain - EthSeer.io</title>
                <meta
                    name='description'
                    content='Check the Ethereum chain slots, to find the block proposer, the number of attestations, the gas used, number of transactions and withdrawals.'
                />
                <meta name='keywords' content='Ethereum, Slots, State, Block, Validator, Proposer, Attestations' />
                <link rel='canonical' href='https://ethseer.io/slots' />
            </Head>

            <h1 className='text-white text-center text-xl md:text-3xl uppercase mt-14 xl:mt-0'>Ethereum Slots</h1>

            <div className='mx-auto py-4 px-6 bg-white/30 border-2 border-dashed rounded-xl flex w-11/12 lg:w-10/12 my-3'>
                <h2 className='text-white text-xs text-center'>
                    Every epoch is divided into regular interval called slots, which occur every 12 seconds. At every
                    slot, one validator can propose a block, and the other validators need to attest on the canonical
                    chain.
                </h2>
            </div>

            <div className='mx-auto w-11/12 md:w-10/12 my-6'>{slots.length > 0 && <SlotsList slots={slots} />}</div>

            {loading && (
                <div className='my-6'>
                    <Loader />
                </div>
            )}

            {slots.length > 0 && <ViewMoreButton onClick={() => getSlots(currentPage + 1)} />}
        </Layout>
    );
};

export default Slots;

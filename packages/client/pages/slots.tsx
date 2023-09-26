import React, { useState, useEffect } from 'react';
import Head from 'next/head';

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

            <h1 className='text-[30px] md:text-[40px] text-center capitalize font-semibold text-black mt-10 mb-4 md:mb-4 md:mt-0'>Ethereum Slots</h1>

            <div className='mx-auto py-4 px-6 text-[12px] md:text-[16px] border rounded-md w-11/12 lg:w-10/12 mb-5'
                        style={{
                            background: themeMode?.darkMode ? 'var(--bgDarkMode)' : 'var(--bgMainLightMode)',
                            borderColor: themeMode?.darkMode ? 'var(--white)' : 'var(--lightGray)',
                        }}>
                <h2
                    className='text-center'
                    style={{
                        color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                    }}
                >
                    Every epoch is divided into regular interval called slots, which occur every 12 seconds. At every
                    slot, one validator can propose a block, and the other validators need to attest on the canonical
                    chain.
                </h2>
            </div>

            <div className='mx-auto max-w-[1100px] my-6'>{slots.length > 0 && <SlotsList slots={slots} />}</div>

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

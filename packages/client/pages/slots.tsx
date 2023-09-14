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
                <title>Slots Storing Key Blockchain State and Validator Information</title>
                <meta
                    name='description'
                    content='Discover how validators and committees utilize 12-second slots in blockchain epochs, enhancing efficiency and security for network validation and management.'
                />
            </Head>

            <h1 className='text-white text-center text-xl md:text-3xl uppercase mt-14 xl:mt-0'>
                Slots Storing Key Blockchain State and Validator Information
            </h1>

            <div className='mx-auto py-4 px-6 bg-white/30 border-2 border-dashed rounded-xl flex w-11/12 lg:w-3/5 my-3' >
                <h2 className='text-xs text-center' style={{
                    color: themeMode?.darkMode ? 'var(--white)' : 'var(--newOrange)'
                }}>
                    Every epoch is divided into regular interval called slots, which occur every 12 seconds. Slots store
                    information about the current state of the blockchain, such as the current set of validators and
                    signatures for the proposed block.
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

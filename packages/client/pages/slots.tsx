import React, { useState, useEffect } from 'react';

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
        <Layout>
            <h1 className='text-white text-center text-xl md:text-3xl uppercase mt-14 xl:mt-0'>Slots</h1>

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

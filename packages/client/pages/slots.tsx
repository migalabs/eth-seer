import React, { useState, useEffect } from 'react';

// Axios
import axiosClient from '../config/axios';

// Components
import Layout from '../components/layouts/Layout';
import SlotsList from '../components/layouts/Slots';

// Types
import { Slot } from '../types';

const Slots = () => {
    // States
    const [slots, setSlots] = useState<Slot[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(false);

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
                    limit: 20,
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
            <h1>Slots</h1>

            <SlotsList slots={slots} />
        </Layout>
    );
};

export default Slots;

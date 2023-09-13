import React, { useState, useEffect } from 'react';

// Axios
import axiosClient from '../config/axios';

// Components
import Layout from '../components/layouts/Layout';
import SlotsList from '../components/layouts/Slots';
import Loader from '../components/ui/Loader';
import ViewMoreButton from '../components/ui/ViewMoreButton';
import CustomImage from '../components/ui/CustomImage';

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
            <h1 className='text-white text-center text-xl md:text-2xl uppercase'>Slots</h1>
            <div className="mx-auto py-4 px-6 bg-white/30 border-2 border-dashed rounded-xl flex w-11/12 lg:w-3/5 my-3">
                <CustomImage
                    src='/static/images/info.webp'
                    alt='More information icon'
                    width={50}
                    height={50}
                    className='object-contain relative bottom-4 right-2'
                />
                <h2 className='text-white text-xs text-center'>
                Every epoch is divided into regular interval called slots, which occur every 12 seconds. Slots store information about the current state of the blockchain, such as the current set of validators and signatures for the proposed block.
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

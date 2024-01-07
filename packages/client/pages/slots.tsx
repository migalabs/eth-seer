import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

// Axios
import axiosClient from '../config/axios';

// Components
import Layout from '../components/layouts/Layout';
import SlotsList from '../components/layouts/Slots';
import Pagination from '../components/ui/Pagination';
import Title from '../components/ui/Title';
import PageDescription from '../components/ui/PageDescription';

// Types
import { Slot } from '../types';

const Slots = () => {
    // Constants
    const LIMIT = 10;

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

            const response = await axiosClient.get('/api/slots', {
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

            <Title>Ethereum Slots</Title>

            <PageDescription>
                Every epoch is divided into regular interval called slots, which occur every 12 seconds. At every slot,
                one validator can propose a block, and the other validators need to attest on the canonical chain.
            </PageDescription>

            {slotsCount > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(slotsCount / LIMIT)}
                    onChangePage={getSlots}
                />
            )}

            <SlotsList slots={slots} fetchingSlots={loading} />
        </Layout>
    );
};

export default Slots;

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
import FiltersSlot from '../components/ui/Filters/FiltersSlot';

// Types
import { Slot, FiltersSlot as FiltersSlotType } from '../types';

const Slots = () => {
    // Router
    const router = useRouter();
    const { network } = router.query;

    // States
    const [slots, setSlots] = useState<Slot[]>([]);
    const [slotsCount, setSlotsCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [numRowsQuery, setNumRowsQuery] = useState(0);
    const [currentFilters, setCurrentFilters] = useState<FiltersSlotType>({});

    useEffect(() => {
        if (network && slots.length === 0) {
            getSlots(0, 10, {});
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [network]);

    const getSlots = async (page: number, limit: number, filters: FiltersSlotType) => {
        try {
            setLoading(true);

            setCurrentPage(page);
            setNumRowsQuery(limit);
            setCurrentFilters(filters);

            const response = await axiosClient.get('/api/slots', {
                params: {
                    network,
                    page,
                    limit,
                    ...filters,
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

            <div className='flex flex-row justify-between items-center gap-x-2 md:gap-x-8 gap-y-4 w-11/12 xl:w-10/12 mx-auto'>
                {slotsCount > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(slotsCount / numRowsQuery)}
                        fullWidth
                        onChangePage={page => getSlots(page, numRowsQuery, currentFilters)}
                        onChangeNumRows={numRows => getSlots(0, numRows, currentFilters)}
                    />
                )}

                <div className='sm:ml-auto'>
                    <FiltersSlot onChangeFilters={filters => getSlots(0, numRowsQuery, filters)} />
                </div>
            </div>

            <SlotsList slots={slots} fetchingSlots={loading} />
        </Layout>
    );
};

export default Slots;

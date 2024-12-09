import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// Axios
import axiosClient from '../config/axios';

// Components
import Layout from '../components/layouts/Layout';
import Pagination from '../components/ui/Pagination';
import Title from '../components/ui/Title';
import PageDescription from '../components/ui/PageDescription';
import SlashedVals from '../components/layouts/SlashedVals';

// Types
import { SlashedVal } from '../types';

const SlashedValidators = () => {
    // Router
    const router = useRouter();
    const { network } = router.query;

    // States
    const [slashedVals, setSlashedVals] = useState<SlashedVal[]>([]);
    const [slashedValsCount, setSlashedValsCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [numRowsQuery, setNumRowsQuery] = useState(0);

    useEffect(() => {
        if (network && slashedVals.length === 0) {
            getSlashedVals(0, 10);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [network]);

    const getSlashedVals = async (page: number, limit: number) => {
        try {
            setLoading(true);

            setCurrentPage(page);
            setNumRowsQuery(limit);

            const response = await axiosClient.get('/api/slashedValidators', {
                params: {
                    network,
                    page,
                    limit,
                },
            });

            setSlashedVals(response.data.slashedValidator);
            setSlashedValsCount(response.data.totalCount);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout
            title='Slashed Validators of the Ethereum Beacon Chain - EthSeer.io'
            description='Check the Ethereum chain slots, to find the block proposer, the number of attestations, the gas used, number of transactions and withdrawals.'
            keywords='Ethereum, Slots, State, Block, Validator, Proposer, Attestations'
            canonical='https://ethseer.io/slashed_validators'
        >
            <Title>Ethereum Slashed Validators</Title>

            <PageDescription>
                Slashing is a penalty imposed on validators for misconduct.
            </PageDescription>

            <div className='flex flex-row justify-between items-center gap-x-2 md:gap-x-8 gap-y-4 w-11/12 xl:w-10/12 mx-auto'>
                {slashedValsCount > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(slashedValsCount / numRowsQuery)}
                        fullWidth
                        onChangePage={page => getSlashedVals(page, numRowsQuery)}
                        onChangeNumRows={numRows => getSlashedVals(0, numRows)}
                    />
                )}
            </div>

            <SlashedVals slashedVals={slashedVals}/>
        </Layout>
    );
};

export default SlashedValidators;

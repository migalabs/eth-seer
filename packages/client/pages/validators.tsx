import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

// Axios
import axiosClient from '../config/axios';

// Hooks
import useLargeView from '../hooks/useLargeView';

// Components
import Layout from '../components/layouts/Layout';
import ValidatorStatus from '../components/ui/ValidatorStatus';
import LinkValidator from '../components/ui/LinkValidator';
import LinkEntity from '../components/ui/LinkEntity';
import Pagination from '../components/ui/Pagination';
import Title from '../components/ui/Title';
import PageDescription from '../components/ui/PageDescription';
import { LargeTable, LargeTableHeader, LargeTableRow, SmallTable, SmallTableCard } from '../components/ui/Table';

// Types
import { Validator } from '../types';

const Validators = () => {
    // Router
    const router = useRouter();
    const { network } = router.query;

    // Large View Hook
    const isLargeView = useLargeView();

    // States
    const [validators, setValidators] = useState<Validator[]>([]);
    const [validatorsCount, setValidatorsCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [numRowsQuery, setNumRowsQuery] = useState(0);

    // UseEffect
    useEffect(() => {
        if (network && validators.length === 0) {
            getValidators(0, 10);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [network]);

    const getValidators = async (page: number, limit: number) => {
        try {
            setLoading(true);

            setCurrentPage(page);
            setNumRowsQuery(limit);

            const response = await axiosClient.get('/api/validators', {
                params: {
                    network,
                    page,
                    limit,
                },
            });

            setValidators(response.data.validators);
            setValidatorsCount(response.data.totalCount);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    // Large View
    const getValidatorsLargeView = () => (
        <LargeTable minWidth={700} noRowsText='No Validators' fetchingRows={loading}>
            <LargeTableHeader text='Validator' />
            <LargeTableHeader text='Balance' />
            <LargeTableHeader text='Entity' />
            <LargeTableHeader text='Status' />

            {validators.map((validator: Validator) => (
                <LargeTableRow key={validator.f_val_idx}>
                    <div className='w-[25%]'>
                        <LinkValidator validator={validator.f_val_idx} mxAuto />
                    </div>

                    <p className='w-[25%] text-center'>{validator.f_balance_eth} ETH</p>

                    <div className='w-[25%]'>
                        <LinkEntity entity={validator.f_pool_name} mxAuto />
                    </div>

                    <div className='flex justify-center w-[25%]'>
                        <ValidatorStatus status={validator.f_status} />
                    </div>
                </LargeTableRow>
            ))}
        </LargeTable>
    );

    // Small View
    const getValidatorsMobile = () => (
        <SmallTable noRowsText='No Validators' fetchingRows={loading}>
            {validators.map((validator: Validator) => (
                <SmallTableCard key={validator.f_val_idx}>
                    <div className='flex w-full items-center justify-between'>
                        <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>Validator</p>
                        <LinkValidator validator={validator.f_val_idx} />
                    </div>

                    <div className='flex w-full items-center justify-between'>
                        <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>Balance</p>
                        <p>{validator.f_balance_eth} ETH</p>
                    </div>

                    <div className='flex w-full items-center justify-between'>
                        <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>Entity</p>
                        <LinkEntity entity={validator.f_pool_name} />
                    </div>

                    <div className='flex w-full items-center justify-between'>
                        <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>Status</p>
                        <ValidatorStatus status={validator.f_status} />
                    </div>
                </SmallTableCard>
            ))}
        </SmallTable>
    );

    return (
        <Layout
            title='Validators of the Ethereum Beacon Chain - EthSeer.io'
            description='Explore Ethereum validators, the entity they belong to, the blocks they have proposed, and their performance over the last week.'
            keywords='Ethereum, Staking, Validators, PoS, Rewards, Performance, Slashing'
            canonical='https://ethseer.io/validators'
        >
            <Title>Ethereum Validators</Title>

            <PageDescription>
                Validators participate in the consensus protocol by proposing and validating blocks. They are subject to
                rewards and penalties based on their behavior. Ethseer displays information about the current validators
                in the Beacon Chain, including detailed information about each validator and its performance.
            </PageDescription>

            {validatorsCount > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(validatorsCount / numRowsQuery)}
                    onChangePage={page => getValidators(page, numRowsQuery)}
                    onChangeNumRows={numRows => getValidators(0, numRows)}
                />
            )}

            <>{isLargeView ? getValidatorsLargeView() : getValidatorsMobile()}</>
        </Layout>
    );
};

export default Validators;

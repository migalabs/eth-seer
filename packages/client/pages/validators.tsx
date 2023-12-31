import React, { useState, useEffect, useContext, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

// Axios
import axiosClient from '../config/axios';

// Contexts
import ThemeModeContext from '../contexts/theme-mode/ThemeModeContext';

// Hooks
import useLargeView from '../hooks/useLargeView';

// Components
import Layout from '../components/layouts/Layout';
import ValidatorStatus from '../components/ui/ValidatorStatus';
import LinkValidator from '../components/ui/LinkValidator';
import LinkEntity from '../components/ui/LinkEntity';
import Pagination from '../components/ui/Pagination';
import Loader from '../components/ui/Loader';
import Title from '../components/ui/Title';

// Types
import { Validator } from '../types';
import PageDescription from '../components/ui/PageDescription';

const Validators = () => {
    // Constants
    const LIMIT = 10;

    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    // Router
    const router = useRouter();
    const { network } = router.query;

    // Refs
    const containerRef = useRef<HTMLInputElement>(null);

    // Large View Hook
    const isLargeView = useLargeView();

    // States
    const [validators, setValidators] = useState<Validator[]>([]);
    const [validatorsCount, setValidatorsCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    // UseEffect
    useEffect(() => {
        if (network && validators.length === 0) {
            getValidators(0);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [network]);

    const getValidators = async (page: number) => {
        try {
            setLoading(true);

            setCurrentPage(page);

            const response = await axiosClient.get('/api/validators', {
                params: {
                    network,
                    page,
                    limit: LIMIT,
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

    const handleMouseMove = (e: any) => {
        if (containerRef.current) {
            const x = e.pageX;
            const limit = 0.15;

            if (x < containerRef.current.clientWidth * limit) {
                containerRef.current.scrollLeft -= 10;
            } else if (x > containerRef.current.clientWidth * (1 - limit)) {
                containerRef.current.scrollLeft += 10;
            }
        }
    };

    //View table desktop
    const getValidatorsDesktop = () => {
        return (
            <div
                ref={containerRef}
                className='flex flex-col mb-4 px-6 md:px-0 overflow-x-scroll overflow-y-hidden scrollbar-thin text-center sm:items-center'
                onMouseMove={handleMouseMove}
            >
                <div className='font-semibold flex gap-x-1 justify-around px-2 xl:px-8 py-3 text-[14px] md:text-[16px] min-w-[700px] w-11/12 md:w-10/12 text-[var(--darkGray)] dark:text-[var(--white)]'>
                    <p className='w-[25%]'>Validator ID</p>
                    <p className='w-[25%]'>Balance</p>
                    <p className='w-[25%]'>Entity</p>
                    <p className='w-[25%]'>Status</p>
                </div>

                <div className='w-11/12 md:w-10/12'>
                    {validators.map((validator: Validator) => (
                        <div
                            key={validator.f_val_idx}
                            className='font-medium my-2 flex gap-x-1 justify-around items-center text-[14px] md:text-[16px] rounded-md border-2 border-white p-2 xl:px-8 text-[var(--black)] dark:text-[var(--white)] bg-[var(--bgMainLightMode)] dark:bg-[var(--bgFairDarkMode)]'
                            style={{
                                boxShadow: themeMode?.darkMode
                                    ? 'var(--boxShadowCardDark)'
                                    : 'var(--boxShadowCardLight)',
                            }}
                        >
                            <div className='w-[25%]'>
                                <LinkValidator validator={validator.f_val_idx} mxAuto />
                            </div>

                            <p className='w-[25%]'>{validator.f_balance_eth} ETH</p>

                            <div className='w-[25%] uppercase'>
                                <LinkEntity entity={validator.f_pool_name || 'others'} mxAuto />
                            </div>

                            <div className='flex justify-center w-[25%]'>
                                <ValidatorStatus status={validator.f_status} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };
    //View table mobile
    const getValidatorsMobile = () => {
        return (
            <div
                ref={containerRef}
                className='mt-4 flex flex-col gap-2 font-medium text-[14px] w-11/12 mx-auto text-[var(--black)] dark:text-[var(--white)]'
                onMouseMove={handleMouseMove}
            >
                {validators.map((validator: Validator) => (
                    <div
                        key={validator.f_val_idx}
                        className='flex flex-col gap-y-2 py-4 px-14 border-2 border-white rounded-md text-[var(--black)] dark:text-[var(--white)] bg-[var(--bgMainLightMode)] dark:bg-[var(--bgFairDarkMode)]'
                        style={{
                            boxShadow: themeMode?.darkMode ? 'var(--boxShadowCardDark)' : 'var(--boxShadowCardLight)',
                        }}
                    >
                        <div className='flex flex-row items-center justify-between'>
                            <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>
                                Validator ID
                            </p>
                            <LinkValidator validator={validator.f_val_idx} />
                        </div>

                        <div className='flex flex-row items-center justify-between'>
                            <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>Balance</p>
                            <p>{validator.f_balance_eth} ETH</p>
                        </div>

                        <div className='flex flex-row items-center justify-between'>
                            <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>Entity</p>
                            <LinkEntity entity={validator.f_pool_name || 'others'} />
                        </div>

                        <div className='flex flex-row items-center justify-between'>
                            <p className='font-semibold text-[var(--darkGray)] dark:text-[var(--white)]'>Status</p>
                            <ValidatorStatus status={validator.f_status} />
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    //OVERVIEW PAGE
    //Overview validators page
    return (
        <Layout hideMetaDescription>
            <Head>
                <title>Validators of the Ethereum Beacon Chain - EthSeer.io</title>
                <meta
                    name='description'
                    content='Explore Ethereum validators, the entity they belong to, the blocks they have proposed, and their performance over the last week.'
                />
                <meta name='keywords' content='Ethereum, Staking, Validators, PoS, Rewards, Performance, Slashing' />
                <link rel='canonical' href='https://ethseer.io/validators' />
            </Head>

            <Title>Ethereum Validators</Title>

            <PageDescription>
                Validators participate in the consensus protocol by proposing and validating blocks. They are subject to
                rewards and penalties based on their behavior. Ethseer displays information about the current validators
                in the Beacon Chain, including detailed information about each validator and its performance.
            </PageDescription>

            {validatorsCount > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(validatorsCount / LIMIT)}
                    onChangePage={getValidators}
                />
            )}

            {loading ? (
                <div className='my-6'>
                    <Loader />
                </div>
            ) : (
                <>{isLargeView ? getValidatorsDesktop() : getValidatorsMobile()}</>
            )}
        </Layout>
    );
};

export default Validators;

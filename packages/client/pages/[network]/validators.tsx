import React, { useState, useEffect, useContext, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

// Axios
import axiosClient from '../../config/axios';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Components
import Layout from '../../components/layouts/Layout';
import ValidatorStatus from '../../components/ui/ValidatorStatus';
import Loader from '../../components/ui/Loader';
import ViewMoreButton from '../../components/ui/ViewMoreButton';
import LinkValidator from '../../components/ui/LinkValidator';
import LinkEntity from '../../components/ui/LinkEntity';

// Types
import { Validator } from '../../types';

const Validators = () => {
    // Router
    const router = useRouter();
    const { network } = router.query;

    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    // Refs
    const containerRef = useRef<HTMLInputElement>(null);

    // States
    const [validators, setValidators] = useState<Validator[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(false);

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
                    limit: 20,
                },
            });

            setValidators(prevState => [
                ...prevState,
                ...response.data.validators.filter(
                    (validator: Validator) =>
                        !prevState.find((prevValidator: Validator) => prevValidator.f_val_idx === validator.f_val_idx)
                ),
            ]);
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

            <h1
                className='text-black text-center font-semibold md:text-[40px] text-[30px] mt-14 xl:mt-0 capitalize'
                style={{
                    color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                }}
            >
                Ethereum Validators
            </h1>

            <div
                className='mx-auto py-4 px-6 border-2 border-[var(--purple)] rounded-md flex w-11/12 lg:w-10/12'
                style={{ background: themeMode?.darkMode ? 'var(--bgDarkMode)' : 'var(--bgMainLightMode)' }}
            >
                <h2
                    className='text-xs 2xl:text-[18px] mx-auto text-center leading-5'
                    style={{
                        color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                    }}
                >
                    Validators participate in the consensus protocol by proposing and validating blocks. They are
                    subject to rewards and penalties based on their behavior. Ethseer displays information about the
                    current validators in the Beacon Chain, including detailed information about each validator and its
                    performance.
                </h2>
            </div>

            <div
                ref={containerRef}
                className='flex flex-col my-6 px-2 xl:px-20 overflow-x-scroll overflow-y-hidden scrollbar-thin text-center sm:items-center'
                onMouseMove={handleMouseMove}
            >
                <div
                    className='font-semibold flex gap-x-1 justify-around px-2 xl:px-8 py-3 text-xs md:text-[16px] min-w-[700px] max-w-[1100px] w-full'
                    style={{
                        color: themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)',
                    }}
                >
                    <p className='w-[25%]'>Validator ID</p>
                    <p className='w-[25%]'>Balance</p>
                    <p className='w-[25%]'>Entity</p>
                    <p className='w-[25%]'>Status</p>
                </div>

                <div
                    className='flex flex-col justify-center gap-y-4 rounded-md border-2 border-white py-5 px-2 xl:px-8 min-w-[700px] max-w-[1100px] w-full'
                    style={{
                        backgroundColor: themeMode?.darkMode ? 'var(--bgFairDarkMode)' : 'var(--bgMainLightMode)',
                        boxShadow: themeMode?.darkMode ? 'var(--boxShadowCardDark)' : 'var(--boxShadowCardLight)',
                        color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                    }}
                >
                    {validators.map((validator: Validator) => (
                        <div
                            key={validator.f_val_idx}
                            className='font-semibold flex gap-x-1 justify-around items-center text-xs md:text-[14px]'
                            style={{
                                color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                            }}
                        >
                            <div className='w-[25%]'>
                                <LinkValidator validator={validator.f_val_idx} mxAuto />
                            </div>

                            <p className='w-[25%]'>{validator.f_balance_eth} ETH</p>

                            <div className='w-[25%] uppercase'>
                                <LinkEntity entity={validator.f_pool_name || 'others'} />
                            </div>

                            <div className='flex justify-center w-[25%]'>
                                <ValidatorStatus status={validator.f_status} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {loading && (
                <div className='my-6'>
                    <Loader />
                </div>
            )}

            <ViewMoreButton onClick={() => getValidators(currentPage + 1)} />
        </Layout>
    );
};

export default Validators;
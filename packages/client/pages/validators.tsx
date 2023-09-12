import React, { useState, useEffect, useContext, useRef } from 'react';
import Head from 'next/head';

// Axios
import axiosClient from '../config/axios';

// Contexts
import ThemeModeContext from '../contexts/theme-mode/ThemeModeContext';

// Components
import Layout from '../components/layouts/Layout';
import ValidatorStatus from '../components/ui/ValidatorStatus';
import Loader from '../components/ui/Loader';
import ViewMoreButton from '../components/ui/ViewMoreButton';
import LinkValidator from '../components/ui/LinkValidator';
import LinkEntity from '../components/ui/LinkEntity';

// Types
import { Validator } from '../types';

const Validators = () => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    // Refs
    const containerRef = useRef<HTMLInputElement>(null);

    // States
    const [validators, setValidators] = useState<Validator[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (validators.length === 0) {
            getValidators(0);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getValidators = async (page: number) => {
        try {
            setLoading(true);
            setCurrentPage(page);

            const response = await axiosClient.get('api/validators', {
                params: {
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
                <title>Understanding Validators: Blockchain Security Contributors</title>
                <meta
                    name='description'
                    content="Explore validator roles in blockchain consensus, behavior-based rewards, and Ethseer's detailed insights into Beacon Chain validator"
                />
            </Head>

            <h1 className='text-white text-center text-xl md:text-3xl uppercase mt-14 xl:mt-0'>
                Understanding Validators: Blockchain Security Contributors
            </h1>

            <div
                ref={containerRef}
                className='flex flex-col my-6 px-2 xl:px-20 overflow-x-scroll overflow-y-hidden scrollbar-thin text-center sm:items-center'
                onMouseMove={handleMouseMove}
            >
                <div className='flex gap-x-1 justify-around px-2 xl:px-8 py-3 uppercase text-sm text-white min-w-[700px] max-w-[1100px] w-full'>
                    <p className='w-[25%]'>Validator ID</p>
                    <p className='w-[25%]'>Balance</p>
                    <p className='w-[25%]'>Entity</p>
                    <p className='w-[25%]'>Status</p>
                </div>

                <div
                    className='flex flex-col justify-center gap-y-4 rounded-[22px] py-5 px-2 xl:px-8 min-w-[700px] max-w-[1100px] w-full'
                    style={{
                        backgroundColor: themeMode?.darkMode ? 'var(--yellow2)' : 'var(--blue1)',
                        boxShadow: themeMode?.darkMode ? 'var(--boxShadowYellow1)' : 'var(--boxShadowBlue1)',
                    }}
                >
                    {validators.map((validator: Validator) => (
                        <div
                            key={validator.f_val_idx}
                            className='flex gap-x-1 justify-around items-center text-[10px] text-black uppercase'
                        >
                            <div className='w-[25%]'>
                                <LinkValidator validator={validator.f_val_idx} mxAuto />
                            </div>

                            <p className='w-[25%]'>{validator.f_balance_eth} ETH</p>

                            <div className='w-[25%]'>
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

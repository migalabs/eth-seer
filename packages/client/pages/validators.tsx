import React, { useState, useEffect, useContext, useRef } from 'react';
import Link from 'next/link';

// Axios
import axiosClient from '../config/axios';

// Contexts
import ThemeModeContext from '../contexts/theme-mode/ThemeModeContext';

// Components
import Layout from '../components/layouts/Layout';
import LinkIcon from '../components/ui/LinkIcon';
import ValidatorStatus from '../components/ui/ValidatorStatus';
import Loader from '../components/ui/Loader';

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

            setValidators(prevState => [...prevState, ...response.data.validators]);
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
        <Layout>
            <div
                ref={containerRef}
                className='flex flex-col px-2 xl:px-20 overflow-x-scroll overflow-y-hidden scrollbar-thin pb-4 text-center mx-auto min-w-[700px] max-w-[1100px]'
                onMouseMove={handleMouseMove}
            >
                <div className='flex gap-x-1 justify-around px-2 xl:px-8 py-3 uppercase text-sm text-white'>
                    <p className='w-[25%]'>Validator ID</p>
                    <p className='w-[25%]'>Balance</p>
                    <p className='w-[25%]'>Entity</p>
                    <p className='w-[25%]'>Status</p>
                </div>

                <div className='flex flex-col justify-center gap-y-4'>
                    {validators.map((validator: Validator) => (
                        <div
                            key={validator.f_val_idx}
                            className='flex gap-x-1 justify-around items-center text-[9px] text-black rounded-[22px] px-2 xl:px-8 py-3 uppercase'
                            style={{
                                backgroundColor: themeMode?.darkMode ? 'var(--yellow2)' : 'var(--blue1)',
                                boxShadow: themeMode?.darkMode ? 'var(--boxShadowYellow1)' : 'var(--boxShadowBlue1)',
                            }}
                        >
                            <div className='w-[25%]'>
                                <Link
                                    href={{
                                        pathname: '/validators/[id]',
                                        query: {
                                            id: validator.f_val_idx,
                                        },
                                    }}
                                    passHref
                                    as={`/validators/${validator.f_val_idx}`}
                                    className='flex gap-x-1 items-center w-fit mx-auto'
                                >
                                    <p>{validator?.f_val_idx?.toLocaleString()}</p>
                                    <LinkIcon />
                                </Link>
                            </div>

                            <p className='w-[25%]'>{validator.f_balance_eth} ETH</p>

                            <div className='w-[25%]'>
                                <Link
                                    href={{
                                        pathname: '/entities/[name]',
                                        query: {
                                            name: validator.f_pool_name || 'others',
                                        },
                                    }}
                                    passHref
                                    as={`/entities/${validator.f_pool_name || 'others'}`}
                                    className='flex gap-x-1 items-center w-fit mx-auto'
                                >
                                    <p>{validator.f_pool_name || 'others'}</p>
                                    <LinkIcon />
                                </Link>
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

            <button
                className='flex cursor-pointer mx-auto w-fit text-[10px] text-black rounded-[22px] px-6 py-4'
                onClick={() => getValidators(currentPage + 1)}
                style={{
                    backgroundColor: themeMode?.darkMode ? 'var(--yellow2)' : 'var(--blue1)',
                    boxShadow: themeMode?.darkMode ? 'var(--boxShadowYellow1)' : 'var(--boxShadowBlue1)',
                }}
            >
                VIEW MORE
            </button>
        </Layout>
    );
};

export default Validators;

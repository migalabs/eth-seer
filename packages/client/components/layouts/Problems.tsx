import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

// Axios
import axiosClient from '../../config/axios';

// Contexts
import StatusContext from '../../contexts/status/StatusContext';
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Components
import CustomImage from '../ui/CustomImage';

const Problems = () => {
    // Router
    const router = useRouter();
    const { network } = router.query;

    // Theme Mode Context
    const { themeMode } = React.useContext(ThemeModeContext) ?? {};

    // Status Contexts
    const { setWorking } = React.useContext(StatusContext) ?? {};

    useEffect(() => {
        if (network) {
            const interval = setInterval(() => {
                checkQueries();
            }, 10000);

            return () => clearInterval(interval);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [network]);

    const checkQueries = async () => {
        try {
            await Promise.all([
                axiosClient.get(`/api/slots/blocks`, {
                    params: {
                        network,
                        limit: 1,
                        page: 0,
                    },
                }),
                axiosClient.get('/api/epochs', {
                    params: {
                        network,
                        limit: 1,
                        page: 0,
                    },
                }),
            ]);

            setWorking?.();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='flex flex-col h-screen justify-center items-center mx-auto w-9/12'>
            <div
                className='my-4 p-5 rounded-md text-[var(--darkGray)] dark:text-[var(--white)] bg-[var(--bgMainLightMode)] dark:bg-[var(--bgFairDarkMode)]'
                style={{
                    boxShadow: themeMode?.darkMode ? 'var(--boxShadowCardDark)' : 'var(--boxShadowCardLight)',
                }}
            >
                <CustomImage
                    src='/static/images/icons/ethseer_logo_problems.webp'
                    alt='Big logo of Ethseer with floating cubes for technical problems page'
                    width={500}
                    height={500}
                    className='mx-auto'
                />

                <p className='md:text-[30px] text-[20px] uppercase text-center text-[var(--black)] dark:text-[var(--white)]'>
                    Sorry, we&apos;re experiencing some problems with the server connection. Please try again in 5
                    minutes. Thank you.
                </p>
            </div>
        </div>
    );
};

export default Problems;

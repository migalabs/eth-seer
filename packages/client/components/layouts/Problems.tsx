import React, { useEffect } from 'react';
import Image from 'next/image';

// Axios
import axiosClient from '../../config/axios';

// Contexts
import StatusContext from '../../contexts/status/StatusContext';

const Problems = () => {
    // Contexts
    const { setWorking } = React.useContext(StatusContext) || {};

    useEffect(() => {
        const interval = setInterval(() => {
            checkQueries();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const checkQueries = async () => {
        try {
            await Promise.all([
                axiosClient.get(`/api/validator-rewards-summary/blocks`, {
                    params: {
                        limit: 1,
                        page: 0,
                    },
                }),
                axiosClient.get('/api/validator-rewards-summary', {
                    params: {
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
        <div className='flex flex-col gap-y-6 px-4 sm:px-14 max-w-[1200px] mx-auto h-screen justify-center'>
            <Image
                src='/static/images/big-logo.svg'
                alt='Big logo of Ethseer'
                width={700}
                height={700}
                className='mx-auto max-h-[70%]'
            />

            <p className='uppercase text-white text-center text-lg md:text-2xl'>
                Sorry, we&apos;re experiencing some problems with the server connection. Please try again in 5 minuts. Thank
                you.
            </p>
        </div>
    );
};

export default Problems;

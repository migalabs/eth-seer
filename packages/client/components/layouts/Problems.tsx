import React, { useEffect } from 'react';

// Axios
import axiosClient from '../../config/axios';

// Contexts
import StatusContext from '../../contexts/status/StatusContext';

// Components
import CustomImage from '../ui/CustomImage';

const Problems = () => {
    // Contexts
    const { setWorking } = React.useContext(StatusContext) ?? {};

    useEffect(() => {
        const interval = setInterval(() => {
            checkQueries();
        }, 10000);

        return () => clearInterval(interval);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const checkQueries = async () => {
        try {
            await Promise.all([
                axiosClient.get(`/api/slots/blocks`, {
                    params: {
                        limit: 1,
                        page: 0,
                    },
                }),
                axiosClient.get('/api/epochs', {
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
            <CustomImage
                src='/static/images/icons/ethseer_logo_problems.webp'
                alt='Big logo of Ethseer with floating cubes for technical problems page'
                width={700}
                height={700}
                className='mx-auto max-h-[70%]'
            />

            <p className='uppercase text-white text-center text-lg md:text-2xl'>
                Sorry, we&apos;re experiencing some problems with the server connection. Please try again in 5 minutes.
                Thank you.
            </p>
        </div>
    );
};

export default Problems;

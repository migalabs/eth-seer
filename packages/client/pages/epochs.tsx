import React from 'react';
import Head from 'next/head';

// Components
import Layout from '../components/layouts/Layout';
import Statitstics from '../components/layouts/Statitstics';
import CustomImage from '../components/ui/CustomImage';

const Epochs = () => {
    return (
        <Layout hideMetaDescription>
            <Head>
                <title>Blockchain Epochs: Timeframes and Security Measures</title>
                <meta
                    name='description'
                    content='Blockchain epochs serve as calendars, maintaining security and efficiency with 32 slots and 6.4-minute durations, while validators confirm block legitimac'
                />
            </Head>

            <div className='my-6 text-center text-white mt-14 xl:mt-0'>
                <h1 className='text-lg md:text-3xl uppercase mb-3'>
                    Blockchain Epochs: Timeframes and Security Measures
                </h1>
                
                <div className='mx-auto py-4 px-6 bg-white/30 border-2 border-dashed rounded-xl flex w-11/12 lg:w-3/5 mb-5'>
                    <h2 className='text-white text-xs text-center'>
                        Epochs in Ethereum refer to a specific period of time in the Beacon Chain. Each epoch has a duration
                        of 6.4 minutes and is composed of 32 slots.
                    </h2>
                </div>

                <Statitstics />
            </div>
        </Layout>
    );
};

export default Epochs;

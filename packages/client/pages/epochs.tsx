import React from 'react';
import Head from 'next/head';

// Components
import Layout from '../components/layouts/Layout';
import Statitstics from '../components/layouts/Statitstics';

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

                <Statitstics />
            </div>
        </Layout>
    );
};

export default Epochs;

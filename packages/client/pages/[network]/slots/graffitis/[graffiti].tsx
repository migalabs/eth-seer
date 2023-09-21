import React from 'react';
import Head from 'next/head';

// Components
import Layout from '../../../../components/layouts/Layout';
import Graffitis from '../../../../components/layouts/Graffitis';

const SlotGraffitiSearch = () => {
    return (
        <Layout>
            <Head>
                <meta name='robots' property='noindex' />
            </Head>

            <Graffitis />
        </Layout>
    );
};

export default SlotGraffitiSearch;

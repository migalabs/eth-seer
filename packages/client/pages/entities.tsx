import React from 'react';
import Head from 'next/head';

// Components
import Layout from '../components/layouts/Layout';
import EntityCard from '../components/ui/EntitiyCard';

// Constants
import { POOLS_EXTENDED } from '../constants';

const Entities = () => {
    return (
        <Layout hideMetaDescription>
            <Head>
                <title>Exploring Entities in Blockchain: Ethseer&apos;s Insights</title>
                <meta
                    name='description'
                    content="Explore blockchain entities and Ethseer's role in gathering essential data, from validators to Ethereum accounts"
                />
            </Head>

            <h1 className='uppercase text-center text-3xl text-white mt-14 xl:mt-0'>
                Exploring Entities in Blockchain: Ethseer&apos;s Insights
            </h1>

            <div
                className='grid gap-4 max-w-[1200px] mx-auto mt-4'
                style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}
            >
                {POOLS_EXTENDED.map((pool, index) => (
                    <EntityCard key={pool} index={index + 1} pool={pool} />
                ))}
            </div>
        </Layout>
    );
};

export default Entities;

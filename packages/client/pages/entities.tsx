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
                <title>Staking Entities - EthSeer</title>
                <meta
                    name='description'
                    content="Explore blockchain entities and Ethseer's role in gathering essential data, from validators to Ethereum accounts."
                />
                <meta name='keywords' content='ethereum, staking, pool, validators, slashing, PoS' />
            </Head>

            <h1 className='uppercase text-center text-3xl text-white mt-14 xl:mt-0'>Ethereum Staking Entities</h1>

            <div className='mx-auto py-4 px-6 bg-white/30 border-2 border-dashed rounded-xl flex w-11/12 lg:w-3/5 my-3'>
                <h2 className='text-white text-xs text-center'>
                    An entity can range from an individual running many validators to an institutional organization
                    providing staking services. If it is running at least 100 validators, we catalog it as an entity.
                    Ethseer obtains information about the entities to which validators belong to through graffiti,
                    deposit address analysis, among others. EthSeer also monitors their performance.
                </h2>
            </div>

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

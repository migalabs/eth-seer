import React, { useContext } from 'react';
import Head from 'next/head';

// Contexts
import ThemeModeContext from '.././contexts/theme-mode/ThemeModeContext';

// Components
import Layout from '../components/layouts/Layout';
import EntityCard from '../components/ui/EntitiyCard';

// Constants
import { POOLS_EXTENDED } from '../constants';

const Entities = () => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

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
                <h2
                    className='text-xs text-center'
                    style={{
                        color: themeMode?.darkMode ? 'var(--white)' : 'var(--newOrange)',
                    }}
                >
                    An entity can range from an individual running many validators to an institutional organization
                    providing staking services. If it is running at least 100 validators, we catalog it as an entity.
                    Ethseer obtains information about the entities to which validators belong to through graffiti,
                    deposit address analysis, among others. EthSeer also monitors their performance.
                </h2>
            </div>

            <div className='grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 w-11/12 md:w-10/12 gap-3 mx-auto mt-4'>
                {POOLS_EXTENDED.map((pool, index) => (
                    <EntityCard key={pool} index={index + 1} pool={pool} />
                ))}
            </div>
        </Layout>
    );
};

export default Entities;

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
                <title>Staking Entities of the Ethereum Beacon Chain - EthSeer.io</title>
                <meta
                    name='description'
                    content='Explore the larger Ethereum blockchain entities that run validators. You will find their number of validators and their performance over the last week.'
                />
                <meta name='keywords' content='Ethereum, Staking, Pool, Validators, Slashing, PoS' />
                <link rel='canonical' href='https://ethseer.io/entities' />
            </Head>
            <h1 className='text-black text-center font-semibold md:text-[40px] text-[30px] mt-14 xl:mt-0 capitalize'>Ethereum Staking Entities</h1>

            <div className='mx-auto py-4 px-6 border-2 border-[var(--purple)] rounded-md flex w-11/12 lg:w-10/12' style={{background: themeMode?.darkMode ? 'var(--bgDarkMode)' : 'var(--bgMainLightMode)'}}>
                <h2 className='text-white text-xs 2xl:text-[18px] text-center leading-5' style={{
                            color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)'
                        }}>
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

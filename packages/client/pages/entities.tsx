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
                <title>Staking Entities of the Ethereum Beacon Chain - EthSeer.io</title>
                <meta
                    name='description'
                    content="Explore the larger Ethereum blockchain entities that run validators. You will find their number of validators and their performance over the last week."
                />
                <meta name='keywords' content='Ethereum, Staking, Pool, Validators, Slashing, PoS' />
                <link rel='canonical' href='https://ethseer.io/entities' />
            </Head>

            <h1 className='text-[30px] md:text-[40px] text-center capitalize font-semibold text-black mt-10 mb-4 md:mb-4 md:mt-0'>Ethereum Staking Entities</h1>

            <div className='mx-auto py-4 px-6 text-[12px] md:text-[16px] border rounded-md w-11/12 lg:w-10/12 mb-5'
                        style={{
                            background: themeMode?.darkMode ? 'var(--bgDarkMode)' : 'var(--bgMainLightMode)',
                            borderColor: themeMode?.darkMode ? 'var(--white)' : 'var(--lightGray)',
                        }}>
                <h2
                    className='text-center'
                    style={{
                        color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                    }}
                >
                    An entity can range from an individual running many validators to an institutional organization providing staking services. If it is running at least 100 validators, we catalog it as an entity. Ethseer obtains information about the entities to which validators belong to through graffiti, deposit address analysis, among others. EthSeer also monitors their performance.
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

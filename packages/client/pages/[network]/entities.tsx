import React, { useContext, useEffect, useState } from 'react';
import Head from 'next/head';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Components
import Layout from '../../components/layouts/Layout';
import EntityCard from '../../components/ui/EntityCard';

// Constants
import { useRouter } from 'next/router';
import axiosClient from '../../config/axios';
import Loader from '../../components/ui/Loader';

const Entities = () => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    // Router
    const router = useRouter();
    const { network } = router.query;

    // States
    const [entities, setEntities] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (network && entities.length === 0) {
            getEntities();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [network]);

    //Entities
    const getEntities = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get(`/api/entities`, {
                params: {
                    network,
                },
            });
            const poolNames = response.data.entities.rows.map((pool: any) => pool.f_pool_name);
            setEntities(poolNames);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    //OVERVIEW PAGE
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

            {/* Header */}
            <h1
                className='text-center font-semibold text-[32px] md:text-[50px] mt-10 xl:mt-0 capitalize m-2 md:m-0'
                style={{
                    color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                }}
            >
                Ethereum Staking Entities
            </h1>

            <div
                className='mx-auto py-4 px-6 border-2 border-[var(--purple)] rounded-md flex w-11/12 lg:w-10/12'
                style={{ background: themeMode?.darkMode ? 'var(--bgDarkMode)' : 'var(--bgMainLightMode)' }}
            >
                <h2
                    className='text-white text-[14px] 2xl:text-[18px] text-center leading-5'
                    style={{
                        color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                    }}
                >
                    An entity can range from an individual running many validators to an institutional organization
                    providing staking services. If it is running at least 100 validators, we catalog it as an entity.
                    Ethseer obtains information about the entities to which validators belong to through graffiti,
                    deposit address analysis, among others. EthSeer also monitors their performance.
                </h2>
            </div>
            {loading && (
                <div className='my-6 justify-center'>
                    <Loader />
                </div>
            )}
            <div className='grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 w-11/12 md:w-10/12 gap-3 mx-auto mt-4'>
                {entities.length > 0 &&
                    entities.map((pool, index) => <EntityCard key={pool} index={index + 1} pool={pool} />)}
            </div>
        </Layout>
    );
};

export default Entities;

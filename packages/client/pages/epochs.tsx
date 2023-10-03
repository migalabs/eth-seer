import React, { useContext } from 'react';
import Head from 'next/head';

// Contexts
import ThemeModeContext from '.././contexts/theme-mode/ThemeModeContext';

// Components
import Layout from '../components/layouts/Layout';
import Statitstics from '../components/layouts/Statitstics';

const Epochs = () => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    return (
        <Layout hideMetaDescription>
            <Head>
                <title>Epochs of the Ethereum Beacon Chain - EthSeer.io</title>
                <meta
                    name='description'
                    content='Check the Ethereum chain epochs, how many blocks were proposed and missed, the attestation participation and the validators active rate.'
                />
                <meta name='keywords' content='Ethereum, Epochs, Timeframes, Security, Validators, Consensus' />
                <link rel='canonical' href='https://ethseer.io/epochs' />
            </Head>

            <div className='my-6 text-center text-white mt-14 xl:mt-0'>
                <h1 className='text-[30px] md:text-[40px] capitalize font-semibold text-black' style={{
                        color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)'
                    }}>Ethereum Epochs</h1>

                <div
                    className='mx-auto py-4 px-6 border-2 border-[var(--purple)] rounded-md flex w-11/12 lg:w-10/12 mb-5'
                    style={{ background: themeMode?.darkMode ? 'var(--bgDarkMode)' : 'var(--bgMainLightMode)' }}
                >
                    <h2
                        className='text-xs 2xl:text-[18px] mx-auto leading-5'
                        style={{
                            color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                        }}
                    >
                        Epochs in Ethereum refer to a specific period of time in the Beacon Chain. Each epoch is
                        composed of 32 slots and has a duration of 6.4 minutes.
                    </h2>
                </div>

                <Statitstics />
            </div>
        </Layout>
    );
};

export default Epochs;

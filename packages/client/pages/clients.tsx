import React, { useContext } from 'react';
import Head from 'next/head';

// Contexts
import ThemeModeContext from '../contexts/theme-mode/ThemeModeContext';

// Components
import Layout from '../components/layouts/Layout';
import Title from '../components/ui/Title';
import PageDescription from '../components/ui/PageDescription';
import CustomImage from '../components/ui/CustomImage';

// Helpers
import {
    getImageUrlClient,
    getImageAltClient,
    getImageUrlLanguage,
    getImageAltLanguage,
} from '../helpers/imageUrlsHelper';

// Constants
import { CLIENTS } from '../constants';

const Clients = () => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    return (
        <Layout hideMetaDescription>
            <Head>
                <title>Clients used to run the Ethereum Chain - EthSeer.io</title>
                <meta
                    name='description'
                    content='Here you can find information about all consensus layer clients used to run Ethereum nodes.'
                />
                <meta
                    name='keywords'
                    content='CL Clients, Ethereum, Software, Lighthouse, Prysm, Lodestar, Nimbus, Teku'
                />
                <link rel='canonical' href='https://ethseer.io/clients' />
            </Head>

            <Title>Ethereum CL Clients</Title>

            <PageDescription>
                Ethereum CL Clients are the software used to run an Ethereum node. Discover them here.
            </PageDescription>

            {/* Client Card */}
            <div className='grid grid-cols-1 xl:grid-cols-2 w-11/12 xl:w-10/12 gap-3 mx-auto'>
                {CLIENTS.map((card, index) => (
                    <div
                        className='flex flex-col gap-4 border-2 border-white rounded-md p-4 lg:p-6 bg-[var(--bgFairLightMode)]'
                        key={index}
                        style={{
                            boxShadow: themeMode?.darkMode ? 'var(--boxShadowCardDark)' : 'var(--boxShadowCardLight)',
                        }}
                    >
                        <div className='flex flex-row items-start gap-2 xl:gap-4 justify-between'>
                            <div className='flex flex-row items-center gap-2 xl:gap-4'>
                                <CustomImage
                                    src={getImageUrlClient(card.name)}
                                    alt={getImageAltClient(card.name)}
                                    width={90}
                                    height={90}
                                    className='w-[60px] h-[60px] lg:w-[90px] lg:h-[90px]'
                                />
                                <div className='flex flex-col gap-1 xl:gap-2 uppercase'>
                                    <span className='text-lg lg:text-2xl text-black dark:text-white font-semibold '>
                                        {card.name.toUpperCase()}
                                    </span>
                                    <span className='text-xs lg:text-sm border border-black dark:border-white text-black dark:text-white rounded-full px-2 py-1'>
                                        Consensus Client
                                    </span>
                                </div>
                            </div>
                            <a
                                className='flex items-center gap-2 p-2 xl:px-4 xl:py-2 bg-white rounded-md'
                                target='_blank'
                                href={card.link}
                                rel='noreferrer'
                            >
                                <span className='text-base xl:block hidden'>Visit site</span>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='20'
                                    height='20'
                                    fill='currentColor'
                                    viewBox='0 0 16 16'
                                >
                                    <path
                                        fillRule='evenodd'
                                        d='M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm5.854 8.803a.5.5 0 1 1-.708-.707L9.243 6H6.475a.5.5 0 1 1 0-1h3.975a.5.5 0 0 1 .5.5v3.975a.5.5 0 1 1-1 0V6.707z'
                                    />
                                </svg>
                            </a>
                        </div>
                        <div className='flex flex-col items-start gap-5'>
                            <p className='text-sm xl:text-base dark:text-white'>{card.description}</p>
                            <div className='flex flex-col items-start gap-2'>
                                <span className='uppercase text-xs xl:text-sm font-medium text-[var(--darkGray)] dark:text-white'>
                                    Programming language:
                                </span>
                                <CustomImage
                                    src={getImageUrlLanguage(card.language)}
                                    alt={getImageAltLanguage(card.language)}
                                    width={90}
                                    height={90}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Layout>
    );
};

export default Clients;

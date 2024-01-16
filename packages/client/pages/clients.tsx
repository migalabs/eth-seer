import React, { useContext } from 'react';
import Head from 'next/head';
import CustomImage from '../components/ui/CustomImage';

// Components
import Layout from '../components/layouts/Layout';
import Title from '../components/ui/Title';
import PageDescription from '../components/ui/PageDescription';

// Contexts
import ThemeModeContext from '../contexts/theme-mode/ThemeModeContext';

const Clients = () => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    // Entities
    const Entities = [
        {
            name: 'Nimbus',
            imgUrl: '/static/images/blocks/cubes/clients/nimbus.webp',
            txtAlt: 'Nimbus',
            text: 'Nimbus is an Ethereum consensus client designed specifically for efficient use of resources. This means Nimbus clients are able to run with high performance on lightweight devices. Running Nimbus on powerful servers leaves free resources to use on other tasks, such as an Ethereum execution node.',
            link: 'https://nimbus.team/',
            imgLng: '/static/images/blocks/cubes/languages/nim.webp',
            txtAltLng: 'Nimbus Programming Language',
        },
        {
            name: 'Teku',
            imgUrl: '/static/images/blocks/cubes/clients/teku.webp',
            txtAlt: 'Teku',
            text: 'Teku runs a full beacon node implementation and validator client in order to participate in Ethereum 2.0s Proof-of-Stake (PoS) consensus. Users can run beacon node synchronization and consensus protocols, propose and attest to blocks on chain, use REST APIs, and manage their validator signing keys externally.',
            link: 'https://consensys.io/teku',
            imgLng: '/static/images/blocks/cubes/languages/java.webp',
            txtAltLng: 'Teku Programming Language',
        },
        {
            name: 'Lighthouse',
            imgUrl: '/static/images/blocks/cubes/clients/lighthouse.webp',
            txtAlt: 'Lighthouse',
            text: 'Lighthouse has undergone rigorous scrutiny, resulting in impressive security and functionality. The Rust implementation allows an extremely performant and sustainable consensus layer at many different scales. Lighthouse is maintained actively by the Sigma Prime organization, guaranteeing updated compatibility with all Ethereum changes.',
            link: 'https://lighthouse.sigmaprime.io/',
            imgLng: '/static/images/blocks/cubes/languages/rust.webp',
            txtAltLng: 'Lighthouse Programming Language',
        },
        {
            name: 'Prysm',
            imgUrl: '/static/images/blocks/cubes/clients/prysm.webp',
            txtAlt: 'Prysm',
            text: 'Prysm uses Golang to directly follow the Ethereum Consensus specification, resulting in a consistent consensus client implementation. The Prysm client focuses on usability, security, and reliability. Alongside their consensus client, Prysm supports gRPC tools, an optimized key-value store, and Protocol Labs for efficient peer-to-peer networking.',
            link: 'https://docs.prylabs.network/docs/getting-started',
            imgLng: '/static/images/blocks/cubes/languages/go.webp',
            txtAltLng: 'Prysm Programming Language',
        },
        {
            name: 'Lodestar',
            imgUrl: '/static/images/blocks/cubes/clients/lodestar.webp',
            txtAlt: 'Lodestar',
            text: 'Lodestar provides first-class security while minimizing trust to bring flexible usage to many users. A light client, Lodestar seeks to enable more people to run full nodes without relying on any other parties. Using Lodestar minimizes hardware requirements while giving users direct access to the Ethereum blockchain and censorship resistance.',
            link: 'https://lodestar.chainsafe.io/',
            imgLng: '/static/images/blocks/cubes/languages/javascript.webp',
            txtAltLng: 'Lodestar Programming Language',
        },
    ];

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
            <div className='grid grid-cols-1 xl:grid-cols-2 w-11/12 md:w-10/12 gap-3 mx-auto'>
                {Entities.map((card, index) => (
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
                                    src={card.imgUrl}
                                    alt={card.txtAlt}
                                    width={90}
                                    height={90}
                                    className='w-[60px] h-[60px] lg:w-[90px] lg:h-[90px]'
                                />
                                <div className='flex flex-col gap-1 xl:gap-2 uppercase'>
                                    <span className='text-lg lg:text-2xl text-black dark:text-white font-semibold '>
                                        {card.name}
                                    </span>
                                    <span className='text-xs lg:text-sm border border-black dark:border-white text-black dark:text-white rounded-full px-2 py-1'>
                                        Consensus Clients
                                    </span>
                                </div>
                            </div>
                            <a
                                className='flex flex-row items-center gap-2 p-2 xl:px-4 xl:py-2 bg-white rounded-md'
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
                                        fill-rule='evenodd'
                                        d='M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm5.854 8.803a.5.5 0 1 1-.708-.707L9.243 6H6.475a.5.5 0 1 1 0-1h3.975a.5.5 0 0 1 .5.5v3.975a.5.5 0 1 1-1 0V6.707z'
                                    />
                                </svg>
                            </a>
                        </div>
                        <div className='flex flex-col items-start gap-5'>
                            <p className='text-sm xl:text-base dark:text-white'>{card.text}</p>
                            <div className='flex flex-col items-start gap-2'>
                                <span className='uppercase text-xs xl:text-sm font-medium text-[var(--darkGray)] dark:text-white'>
                                    Programming language:
                                </span>
                                <CustomImage src={card.imgLng} alt={card.txtAltLng} width={90} height={90} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Layout>
    );
};

export default Clients;

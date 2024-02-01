import React, { useContext } from 'react';

// Contexts
import ThemeModeContext from '../contexts/theme-mode/ThemeModeContext';

// Components
import Layout from '../components/layouts/Layout';
import Title from '../components/ui/Title';
import PageDescription from '../components/ui/PageDescription';
import CustomImage from '../components/ui/CustomImage';

const Clients = () => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    // Clients
    const clients = [
        {
            name: 'Nimbus',
            imgUrl: '/static/images/blocks/cubes/clients/nimbus.webp',
            txtAlt: 'Nimbus',
            text: "Nimbus is a client implementation for both Ethereum's consensus layer (eth2) and execution layer (eth1) that strives to be as lightweight as possible in terms of resources used. This allows it to perform well on embedded systems, embedded devices - including Raspberry Pis and mobile devices.",
            link: 'https://nimbus.team/',
            imgLng: '/static/images/blocks/cubes/languages/nim.webp',
            txtAltLng: 'Nimbus Programming Language',
        },
        {
            name: 'Teku',
            imgUrl: '/static/images/blocks/cubes/clients/teku.webp',
            txtAlt: 'Teku',
            text: 'Teku is an open source Ethereum consensus client (previously called an Ethereum 2.0 client) written in Java. Teku contains a full beacon node implementation and a validator client for participating in proof of stake consensus. Written in Java and maintained by the same team behind Besu, Teku is equipped to bring staking services to businesses.',
            link: 'https://consensys.io/teku',
            imgLng: '/static/images/blocks/cubes/languages/java.webp',
            txtAltLng: 'Teku Programming Language',
        },
        {
            name: 'Lighthouse',
            imgUrl: '/static/images/blocks/cubes/clients/lighthouse.webp',
            txtAlt: 'Lighthouse',
            text: 'Lighthouse is an Ethereum consensus client that connects to other Ethereum consensus clients to form a resilient and decentralized proof-of-stake blockchain. They implement the specification as defined in the ethereum/consensus-specs repository.',
            link: 'https://lighthouse.sigmaprime.io/',
            imgLng: '/static/images/blocks/cubes/languages/rust.webp',
            txtAltLng: 'Lighthouse Programming Language',
        },
        {
            name: 'Prysm',
            imgUrl: '/static/images/blocks/cubes/clients/prysm.webp',
            txtAlt: 'Prysm',
            text: "Prysm is an Ethereum proof-of-stake client written in Go. You can use Prysm to participate in Ethereum's decentralized economy by running a node and, if you have 32 ETH to stake, a validator client.",
            link: 'https://docs.prylabs.network/docs/getting-started',
            imgLng: '/static/images/blocks/cubes/languages/go.webp',
            txtAltLng: 'Prysm Programming Language',
        },
        {
            name: 'Lodestar',
            imgUrl: '/static/images/blocks/cubes/clients/lodestar.webp',
            txtAlt: 'Lodestar',
            text: "Lodestar is a consensus beacon node and validator client for the Ethereum blockchain. Lodestar's tools and libraries enable Ethereum protocol development for the JavaScript ecosystem.",
            link: 'https://lodestar.chainsafe.io/',
            imgLng: '/static/images/blocks/cubes/languages/javascript.webp',
            txtAltLng: 'Lodestar Programming Language',
        },
    ];

    return (
        <Layout
            title='Clients used to run the Ethereum Chain - EthSeer.io'
            description='Here you can find information about all consensus layer clients used to run Ethereum nodes.'
            keywords='CL Clients, Ethereum, Software, Lighthouse, Prysm, Lodestar, Nimbus, Teku'
            canonical='https://ethseer.io/clients'
        >
            <Title>Ethereum CL Clients</Title>

            <PageDescription>
                Ethereum CL Clients are the software used to run an Ethereum node. Discover them here.
            </PageDescription>

            {/* Client Card */}
            <div className='grid grid-cols-1 xl:grid-cols-2 w-11/12 xl:w-10/12 gap-3 mx-auto'>
                {clients.map((card, index) => (
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

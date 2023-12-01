import React from 'react';
import Head from 'next/head';
import Image from 'next/image';

// Components
import Header from './Header';
import Consent from './Consent';
import Background from './Background';
import Footer from './Footer';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Images
import FooterHeartImage from '../../public/static/images/footer/footer_heart.webp';

type PropsWithChildren = {
    children?: React.ReactNode;
    hideMetaDescription?: boolean;
};

const Layout = ({ hideMetaDescription, children }: PropsWithChildren) => {
    // Theme Mode Context
    const { themeMode } = React.useContext(ThemeModeContext) ?? {};

    return (
        <div className='flex flex-col min-h-screen'>
            <Head>
                <title>Ethereum Blockchain Explorer - EthSeer.io</title>

                {!hideMetaDescription && (
                    <meta
                        name='description'
                        content="Ethseer is an Ethereum Blockchain Explorer. It provides real-time data and statistics on Ethereum's latest epochs, slots, validators and staking entities."
                    />
                )}

                <link rel='canonical' href='https://ethseer.io' />
            </Head>

            <Header />

            <Background />
            <main className='my-6 flex-1'>{children}</main>

            <Footer></Footer>

            <Consent />
        </div>
    );
};

export default Layout;

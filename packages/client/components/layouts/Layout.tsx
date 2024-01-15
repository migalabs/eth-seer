import React from 'react';
import Head from 'next/head';

// Components
import Header from './Header';
import Consent from './Consent';
import Background from './Background';
import Footer from './Footer';

type Props = {
    children?: React.ReactNode;
    hideMetaDescription?: boolean;
};

const Layout = ({ hideMetaDescription, children }: Props) => {
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

            <Footer />

            <Consent />
        </div>
    );
};

export default Layout;

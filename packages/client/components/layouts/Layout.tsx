import React, { useEffect, useState } from 'react';
import Head from 'next/head';

// Components
import Header from './Header';
import Consent from './Consent';
import Background from './Background';
import Footer from './Footer';

type Props = {
    title?: string;
    description?: string;
    keywords?: string;
    canonical?: string;
    children?: React.ReactNode;
};

const Layout = ({ title, description, canonical, keywords, children }: Props) => {
    // States
    const [url, setUrl] = useState('');

    useEffect(() => {
        setUrl(window.location.href);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const defaultTitle = 'Ethereum Blockchain Explorer - EthSeer.io';
    const defaultDescription =
        "Ethseer is an Ethereum Blockchain Explorer. It provides real-time data and statistics on Ethereum's latest epochs, slots, validators and staking entities.";
    const defaultKeywords = 'Ethereum, Ethereum Blockchain Explorer, Ethereum Block Explorer, Search';

    return (
        <div className='flex flex-col min-h-screen'>
            <Head>
                <title>{title ?? defaultTitle}</title>
                <meta property='og:title' content={title ?? defaultTitle} />
                <meta name='twitter:title' content={title ?? defaultTitle} />

                <meta name='description' content={description ?? defaultDescription} />
                <meta property='og:description' content={description ?? defaultDescription} />
                <meta name='twitter:description' content={description ?? defaultDescription} />

                <meta name='keywords' content={keywords ?? defaultKeywords} />

                {canonical && <link rel='canonical' href={canonical} />}

                {url && <meta property='og:url' content={url} />}
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

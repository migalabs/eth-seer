import Head from 'next/head';
import React, { PropsWithChildren } from 'react';

// Components
import Header from './Header';
import Consent from './Consent';

type PropsWithChildren = {
    children?: React.ReactNode;
    isMain: boolean;
};

const Layout = ({ children, isMain }: PropsWithChildren) => {
    return (
        <>
            <Head>
                <title>Ethseer Stats</title>
            </Head>

            <Header isMain={isMain} />

            <main>{children}</main>

            <footer className='text-center my-4'>
                <p className='text-white hidden'>
                    Powered by&nbsp;
                    <a className='underline' href='https://migalabs.es/' target='_blank' rel='noreferrer'>
                        Miga Labs.
                    </a>
                    &nbsp; 2022.
                </p>
            </footer>

            <Consent />
        </>
    );
};

export default Layout;

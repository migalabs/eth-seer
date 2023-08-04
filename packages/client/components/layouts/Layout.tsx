import React from 'react';
import Head from 'next/head';
import Image from 'next/image';

// Components
import Header from './Header';
import Consent from './Consent';

// Images
import CookieHeartImage from '../../public/static/images/cookie_heart.svg';

type PropsWithChildren = {
    children?: React.ReactNode;
    isMain?: boolean;
};

const Layout = ({ children, isMain }: PropsWithChildren) => {
    return (
        <>
            <Head>
                <title>Ethereum (ETH) blockchain explorer - EthSeer.io</title>
                <link rel="canonical" href="https://ethseer.io/" />
            </Head>

            <Header isMain={isMain} />

            <main className='mt-20 md:mt-4 min-h-screen'>{children}</main>

            <footer className='text-center text-[7.5px] md:text-sm p-2.5 mt-4 bg-[#D9D9D94D]'>
                <div className='flex flex-row justify-center '>
                    <p className='text-white uppercase mt-2'>Powered with</p>
                    <Image src={CookieHeartImage} alt='Cookie Heart' />
                    <p className='text-white uppercase mt-2 ml-1.5'>
                        by&nbsp;
                        <a className='underline' href='https://migalabs.io/' target='_blank' rel='noreferrer'>
                            MigaLabs
                        </a>
                        &nbsp;® 2023-2024
                    </p>
                </div>
            </footer>

            <Consent />
        </>
    );
};

export default Layout;

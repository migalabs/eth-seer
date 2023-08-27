import React from 'react';
import Head from 'next/head';
import Image from 'next/image';

// Components
import Header from './Header';
import Consent from './Consent';

// Images
import FooterHeartImage from '../../public/static/images/footer/footer_heart.svg';

type PropsWithChildren = {
    children?: React.ReactNode;
    isMain?: boolean;
};

const Layout = ({ children, isMain }: PropsWithChildren) => {
    return (
        <div className='flex flex-col min-h-screen'>
            <Head>
                <title>Ethereum Blockchain Explorer - EthSeer.io</title>
                <link rel='canonical' href='https://ethseer.io' />
            </Head>

            <Header isMain={isMain} />

            <main className='my-6 flex-1'>{children}</main>

            <footer className='text-center text-[7.5px] md:text-sm p-2 bg-[#D9D9D94D]'>
                <div className='flex flex-row justify-center items-center text-white'>
                    <p>Powered with</p>
                    <Image src={FooterHeartImage} alt='Heart illustration' className='mx-1' />
                    <p>
                        by&nbsp;
                        <a className='underline uppercase' href='https://migalabs.io/' target='_blank' rel='noreferrer'>
                            MigaLabs
                        </a>
                        &nbsp;® 2023-2024
                    </p>
                </div>
            </footer>

            <Consent />
        </div>
    );
};

export default Layout;

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
        <>
            <Head>
                <title>Ethseer Ethereum Blockchain Explorer</title>
            </Head>

            <Header isMain={isMain} />

            <main className='mt-20 md:mt-4 min-h-screen'>{children}</main>

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
        </>
    );
};

export default Layout;

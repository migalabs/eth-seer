import React from 'react';
import Head from 'next/head';

// Components
import Header from './Header';
import Consent from './Consent';

type PropsWithChildren = {
    children?: React.ReactNode;
    isMain?: boolean;
};

const Layout = ({ children, isMain }: PropsWithChildren) => {
    const assetPrefix = process.env.NEXT_PUBLIC_ASSET_PREFIX ?? '';
    return (
        <>
            <Head>
                <title>Ethseer Ethereum Blockchain Explorer</title>
            </Head>

            <Header isMain={isMain} />

            <main className='mt-20 md:mt-4'>{children}</main>

            {isMain ? (
                <footer className='text-center text-[7.5px] md:text-sm p-2.5 mt-2 bg-[#D9D9D94D]'>
                    <div className='flex flex-row justify-center '>
                        <p className='text-white uppercase mt-2'>Powered with</p>
                        <img className='' src={`${assetPrefix}/static/images/cookie_heart.svg`} />
                        <p className='text-white uppercase mt-2 ml-1.5'>
                            by&nbsp;
                            <a className='underline' href='https://migalabs.io/' target='_blank' rel='noreferrer'>
                                Miga Labs
                            </a>
                            &nbsp;® 2023-2024
                        </p>
                    </div>
                </footer>
            ) : (
                <footer className='text-center text-sm my-4'></footer>
            )}

            <Consent />
        </>
    );
};

export default Layout;

import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';

// Components
import CustomImage from '../components/ui/CustomImage';

//Context
import ThemeModeContext from '.././contexts/theme-mode/ThemeModeContext';
// Constants
import { DEFAULT_NETWORK } from '../constants';

const NotFoundPage = () => {
    // Theme Mode Context
    const { themeMode } = React.useContext(ThemeModeContext) ?? {};

    return (
        <>
            <Head>
                <title>404 Page Not Found - Ethseer</title>
            </Head>
            <div className='flex flex-col h-screen justify-between'>
                <Header></Header>
                <div
                    className='flex flex-col items-center w-9/12 mx-auto rounded-md py-5'
                    style={{
                        color: themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)',
                        backgroundColor: themeMode?.darkMode ? 'var(--bgFairDarkMode)' : 'var(--bgMainLightMode)',
                        boxShadow: themeMode?.darkMode ? 'var(--boxShadowCardDark)' : 'var(--boxShadowCardLight)',
                    }}
                >
                    <CustomImage
                        src={`/static/images/error/404_${themeMode?.darkMode ? 'dark' : 'light'}.webp`}
                        alt='404 illustration for error page'
                        width={500}
                        height={500}
                        className='w-9/12 md:w-5/12'
                    />
                    <span className='md:text-[30px] text-[20px] uppercase text-center'>
                        Sorry. We couldn&apos;t find the page you were looking for.
                    </span>
                    <Link href={`/${DEFAULT_NETWORK}`} passHref className='p-4 my-4 rounded-md bg-[#c9b6f8] md:hover:bg-white transition'>
                        <span
                            className='md:text-2xl text-lg'
                            style={{
                                color: themeMode?.darkMode ? 'var(--black)' : 'var(--darkGray)',
                            }}
                        >
                            Go back home
                        </span>
                    </Link>
                </div>
                <Footer></Footer>
            </div>
        </>
    );
};

export default NotFoundPage;

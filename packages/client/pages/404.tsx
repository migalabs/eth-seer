import React from 'react';
import Link from 'next/link';
import Head from 'next/head';

//Context
import ThemeModeContext from '.././contexts/theme-mode/ThemeModeContext';

// Components
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import CustomImage from '../components/ui/CustomImage';

const NotFoundPage = () => {
    // Theme Mode Context
    const { themeMode } = React.useContext(ThemeModeContext) ?? {};

    return (
        <>
            <Head>
                <title>404 Page Not Found - Ethseer</title>
            </Head>

            <div className='flex flex-col h-screen justify-between'>
                <Header />

                <CustomImage
                    src={`/static/images/error/error_${themeMode?.darkMode ? 'dark' : 'light'}.webp`}
                    alt='404 illustration for error page'
                    width={300}
                    height={300}
                    className='sm:block 2xl:w-1/4 -bottom-24 hidden fixed -z-10'
                />

                <div
                    className='flex flex-col items-center w-9/12 mx-auto rounded-md py-5 text-[var(--darkGray)] dark:text-[var(--white)] bg-[var(--bgMainLightMode)] dark:bg-[var(--bgFairDarkMode)]'
                    style={{
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

                    <Link href='/' passHref className='p-4 my-4 rounded-md bg-[#c9b6f8] md:hover:bg-white transition'>
                        <span className='md:text-2xl text-lg font-medium text-[var(--black)] dark:text-[var(--darkGray)]'>
                            Go back home
                        </span>
                    </Link>
                </div>

                <Footer />
            </div>
        </>
    );
};

export default NotFoundPage;

import React from 'react';
import Link from 'next/link';
import Head from 'next/head';

// Components
import CustomImage from '../components/ui/CustomImage';

const NotFoundPage = () => {
    return (
        <>
            <Head>
                <title>404 - Ethseer</title>
            </Head>

            <div className='flex flex-col items-center justify-center h-screen gap-y-6 text-white uppercase'>
                <CustomImage
                    src='/static/images/error/404.webp'
                    alt='404 illustration for error page'
                    width={1920}
                    height={1080}
                    className='xl:w-4/12 md:w-5/12 w-7/12'
                />

                <p className='2xl:text-4xl md:text-3xl sm:text-2xl text-xl'>Page not found</p>

                <p className='2xl:text-lg md:text-base sm:text-sm text-xs'>
                    Sorry. We couldn&apos;t find the <br /> page you were looking for.
                </p>

                <div className='relative mt-4 lg:mt-8'>
                    <Link href='/' passHref className='relative px-3 py-2 md:px-7 md:py-4 text-white group'>
                        <span className='absolute inset-0 w-full h-full transition duration-300 transform -translate-x-1 -translate-y-1 bg-blue-300 ease opacity-90 md:group-hover:translate-x-0 md:group-hover:translate-y-0'></span>
                        <span className='absolute inset-0 w-full h-full transition duration-300 transform translate-x-1 translate-y-1 bg-purple-900 ease md:group-hover:translate-x-0 md:group-hover:translate-y-0 mix-blend-screen'></span>
                        <span className='relative text-lg md:text-2xl'>Go back home</span>
                    </Link>
                    <CustomImage
                        src='/static/images/error/ghost_404.webp'
                        alt='Ghost illustration for error page'
                        width={250}
                        height={250}
                        className='absolute top-[-60px] right-[-250px] hidden md:block ghost'
                    />
                </div>
            </div>
        </>
    );
};

export default NotFoundPage;

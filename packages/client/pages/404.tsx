import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styled from '@emotion/styled';

// Components
import CustomImage from '../components/ui/CustomImage';

// Styled
const Button = styled.div`
    background-color: #90d1f4;
    box-shadow: inset -6px -6px 10px rgba(20, 21, 62, 0.6), inset 6px 6px 10px rgba(20, 21, 62, 0.6);

    p {
        color: white;
    }

    &:hover {
        background-color: white;
        box-shadow: inset -6px -6px 10px rgba(20, 21, 62, 0.6), inset 6px 6px 10px rgba(20, 21, 62, 0.6);

        p {
            color: #90d1f4;
        }
    }
`;

const NotFoundPage = () => {
    return (
        <>
            <Head>
                <title>404 - Ethseer</title>
            </Head>

            <div className='flex flex-col items-center justify-center h-screen gap-y-6 text-white uppercase'>
                <CustomImage
                    src='/static/images/404.svg'
                    alt='404'
                    width={1920}
                    height={1080}
                    className='xl:w-4/12 md:w-5/12 w-7/12'
                />

                <p className='2xl:text-4xl md:text-3xl sm:text-2xl text-xl'>Page not found</p>

                <p className='2xl:text-lg md:text-base sm:text-sm text-xs'>
                    Sorry. We couldn&apos;t find the <br /> page you were looking for.
                </p>

                <div className='relative mt-10'>
                    <Link href='/' passHref>
                        <Button className='w-fit rounded-[50px] py-4 px-5 md:py-4 md:px-5 mx-auto'>
                            <p className='uppercase 2xl:text-base xl:text-xl md:text-base text-sm'>Go back home</p>
                        </Button>
                    </Link>

                    <CustomImage
                        src='/static/images/ghost.svg'
                        alt='Ghost'
                        width={200}
                        height={200}
                        className='absolute top-[60px] right-[0px] sm:top-[-30px] sm:right-[-180px] ghost'
                    />
                </div>
            </div>
        </>
    );
};

export default NotFoundPage;

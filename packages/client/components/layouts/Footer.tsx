import React from 'react';
import Image from 'next/image';

// Images
import FooterHeartImage from '../../public/static/images/footer/footer_heart.webp';

const Footer = () => {
    return (
        <footer className='text-center text-[12px] md:text-[15px] p-2 bg-[var(--bgStrongLightMode)] dark:bg-[var(--bgFairLightMode)]'>
            <div className='flex flex-row justify-center items-center text-[var(--black)] dark:text-[var(--white)]'>
                <p>Powered with</p>
                <Image src={FooterHeartImage} alt='Heart illustration' className='mx-1 w-6' />
                <p>
                    by&nbsp;
                    <a className='underline uppercase' href='https://migalabs.io/' target='_blank' rel='noreferrer'>
                        MigaLabs
                    </a>
                    &nbsp;® 2023-2024
                </p>
            </div>
        </footer>
    );
};

export default Footer;

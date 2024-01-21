import React from 'react';
import Image from 'next/image';

// Images
import FooterHeartImage from '../../public/static/images/footer/footer_heart.webp';

const Footer = () => {
    return (
        <footer className='text-[12px] md:text-[15px] p-2 bg-[var(--bgStrongLightMode)] dark:bg-[var(--bgFairLightMode)]'>
            <div className='flex justify-center items-center text-[var(--black)] dark:text-[var(--white)]'>
                <span>Powered with&nbsp;</span>
                <Image src={FooterHeartImage} alt='Heart illustration' className='w-6' />
                <span>&nbsp;by&nbsp;</span>
                <a className='underline uppercase' href='https://migalabs.io/' target='_blank' rel='noreferrer'>
                    MigaLabs
                </a>
                <span>&nbsp;® 2023-2024</span>
            </div>
        </footer>
    );
};

export default Footer;

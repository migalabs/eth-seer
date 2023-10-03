import React from 'react';
import Image from 'next/image';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Images
import FooterHeartImage from '../../public/static/images/footer/footer_heart.webp';

const Footer = () => {
    // Theme Mode Context
    const { themeMode } = React.useContext(ThemeModeContext) ?? {};

    return (
        <footer
            className='text-center text-[12px] md:text-[15px] p-2'
            style={{
                background: themeMode?.darkMode ? 'var(--bgFairLightMode)' : 'var(--bgStrongLightMode)',
            }}
        >
            <div
                className='flex flex-row justify-center items-center'
                style={{
                    color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                }}
            >
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

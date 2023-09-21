import React from 'react';
import Link from 'next/link';

// Components
import CustomImage from '../ui/CustomImage';
import Menu from '../ui/Menu';
import SearchEngine from '../ui/SearchEngine';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

const Header = () => {
    // Theme Mode Context
    const { themeMode } = React.useContext(ThemeModeContext) ?? {};

    return (
        <div
            className='flex justify-between'
            style={{ background: themeMode?.darkMode ? 'var(--bgDarkMode)' : 'var(--white)' }}
        >
            <div className='w-fit'>
                <Link href='/' passHref>
                    <div className='flex flex-row justify-start items-center p-2'>
                        <CustomImage
                            src={`/static/images/icons/ethseer_logo_${themeMode?.darkMode ? 'dark' : 'light'}.webp`}
                            alt='Logo'
                            width={50}
                            height={50}
                        />

                        <p
                            className='uppercase text-[16px] md:text-[30px] mt-1 ml-2'
                            style={{
                                color: themeMode?.darkMode ? 'var(--white)' : 'var(--newOrange)',
                            }}
                        >
                            <b>Ethseer</b>.io
                        </p>
                    </div>
                </Link>
            </div>
            <div className='flex flex-row gap-x-5 items-start mt-2.5'>
                <SearchEngine />
                <Menu />
            </div>
        </div>
    );
};

export default Header;

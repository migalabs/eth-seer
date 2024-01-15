import React from 'react';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Components
import CustomImage from '../ui/CustomImage';
import Menu from '../ui/Menu';
import SearchEngine from '../ui/SearchEngine';
import NetworkLink from '../ui/NetworkLink';

const Header = () => {
    // Theme Mode Context
    const { themeMode } = React.useContext(ThemeModeContext) ?? {};

    return (
        <div className='flex justify-between items-center bg-[var(--white)] dark:bg-[var(--bgDarkMode)]'>
            <div className='w-fit'>
                <NetworkLink href='/' passHref>
                    <div className='flex flex-row justify-start items-center p-2'>
                        <CustomImage
                            src={`/static/images/icons/ethseer_logo_${themeMode?.darkMode ? 'dark' : 'light'}.webp`}
                            alt='Logo'
                            width={50}
                            height={50}
                        />
                        <p className='uppercase text-[20px] md:text-[30px] mt-1 ml-2 text-[var(--newOrange)] dark:text-[var(--white)]'>
                            <b>Ethseer</b>.io
                        </p>
                    </div>
                </NetworkLink>
            </div>
            <SearchEngine />
            <Menu />
        </div>
    );
};

export default Header;

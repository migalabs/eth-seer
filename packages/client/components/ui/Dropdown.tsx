import React, { useState, useContext, Fragment } from 'react';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

//Components
import NetworkLink from './NetworkLink';

// Types
type Item = {
    name: string;
    route: string;
};

type Props = {
    name: string;
    items: Item[];
    useNetworkLink?: boolean;
};

const Dropdown = ({ name, items, useNetworkLink }: Props) => {
    const [isOpen, setIsOpen] = useState(false);

    const { themeMode } = useContext(ThemeModeContext) ?? {};

    const handleMouseEnter = () => {
        if (window.innerWidth >= 768) {
            setIsOpen(true);
        }
    };

    const handleMouseLeave = () => {
        if (window.innerWidth >= 768) {
            setIsOpen(false);
        }
    };

    const handleButtonClick = () => {
        if (window.innerWidth < 768) {
            setIsOpen(!isOpen);
        }
    };

    const dropdownStyle = {
        opacity: isOpen ? 1 : 0,
        height: isOpen ? 'auto' : 0,
        transition: 'opacity 0.3s ease, height 0.3s ease',
    };

    return (
        <div
            className='relative py-2 md:p-0'
            style={{
                color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button
                type='button'
                className='w-full text-[16px] flex items-center justify-end relative'
                onClick={handleButtonClick}
            >
                <span>{name}</span>
                <svg
                    className={`w-3 h-3 ml-1 transform ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                    aria-hidden='true'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 10 6'
                >
                    <path
                        stroke='currentColor'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='m1 1 4 4 4-4'
                    />
                </svg>
            </button>

            <div
                className={`relative md:absolute`}
                style={{
                    ...dropdownStyle,
                    right: 0,
                    top: '100%',
                }}
            >
                {isOpen && (
                    <div
                        className='p-1 md:p-3 rounded-md md:border'
                        style={{
                            background: themeMode?.darkMode ? 'var(--bgDarkMode)' : 'var(--white)',
                            borderColor: themeMode?.darkMode ? 'var(--white)' : 'var(--darkGray)',
                        }}
                    >
                        {items.map(item => (
                            <NetworkLink
                                key={item.name}
                                href={item.route}
                                className={`block px-4 py-2 my-1 text-[16px] rounded-md bg-[#a19f9f50] md:bg-transparent md:font-semibold  hover:text-black transition-colors duration-300 md:hover:bg-[#c9b6f8] ${
                                    themeMode?.darkMode ? 'md:hover:text-black' : 'md:hover:text-white'
                                }`}
                            >
                                {item.name}
                            </NetworkLink>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dropdown;

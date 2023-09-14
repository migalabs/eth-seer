import React, { useState, useContext } from 'react';
import Link from 'next/link';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Types
type Item = {
    name: string;
    route: string;
};

type Props = {
    name: string;
    items: Item[];
};

const Dropdown = ({ name, items }: Props) => {
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

    return (
        <div
            className='relative py-2 md:p-0'
            style={{
                color: themeMode?.darkMode ? 'var(--white)' : '#000000',
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button
                type='button'
                className='w-full text-xs uppercase flex items-center justify-end relative'
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
                className={`relative md:absolute transition-opacity duration-300 ${
                    isOpen ? 'opacity-100 h-auto' : 'opacity-0 h-0'
                } absolute right-0 mt-1 md:mt-0.5`}
            >
                {isOpen && (
                    <div
                        className='p-1 md:p-2 rounded-lg'
                        style={{
                            background: themeMode?.darkMode ? '#f2dc8e' : '#ecb77b',
                        }}
                    >
                        {items.map(item => (
                            <Link
                                key={item.name}
                                href={item.route}
                                className='block px-4 py-2 my-1 text-sm rounded-lg transition'
                                style={{
                                    background: themeMode?.darkMode ? '#c57f1860' : 'var(--blue2)',
                                    color: themeMode?.darkMode ? 'var(--white)' : '#000000',
                                }}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dropdown;

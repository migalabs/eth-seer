import React, { useState } from 'react';

// Hooks
import useLargeView from '../../hooks/useLargeView';

//Components
import NetworkLink from './NetworkLink';

// Types
type Item = {
    name: string;
    route: string;
};

// Props
type Props = {
    name: string;
    items: Item[];
    useNetworkLink?: boolean;
};

const Dropdown = ({ name, items, useNetworkLink }: Props) => {
    // Large View Hook
    const largeView = useLargeView();

    // States
    const [isOpen, setIsOpen] = useState(false);

    const handleMouseEnter = () => {
        if (largeView) {
            setIsOpen(true);
        }
    };

    const handleMouseLeave = () => {
        if (largeView) {
            setIsOpen(false);
        }
    };

    const handleButtonClick = () => {
        if (!largeView) {
            setIsOpen(!isOpen);
        }
    };

    return (
        <div
            className='relative py-2 md:p-0 text-[var(--black)] dark:text-[var(--white)]'
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
                className={`relative md:absolute transition-opacity duration-300 ${
                    isOpen ? 'opacity-100 h-auto' : 'opacity-0 h-0'
                } absolute right-0`}
            >
                {isOpen && (
                    <div className='p-1 md:p-3 rounded-md md:border bg-[var(--white)] dark:bg-[var(--bgDarkMode)] border-[var(--darkGray)] dark:border-[var(--white)]'>
                        {items.map(item => {
                            return useNetworkLink ? (
                                <NetworkLink
                                    key={item.name}
                                    href={item.route}
                                    className='block px-4 py-2 my-1 text-[16px] rounded-md bg-[#a19f9f50] md:bg-transparent md:hover:bg-[#c9b6f8] transition md:font-semibold md:hover:text-[var(--white)] dark:md:hover:text-[var(--black)]'
                                >
                                    {item.name}
                                </NetworkLink>
                            ) : (
                                <a
                                    key={item.name}
                                    href={item.route}
                                    className='block px-4 py-2 my-1 text-[16px] rounded-md bg-[#a19f9f50] md:bg-transparent md:hover:bg-[#c9b6f8] transition md:font-semibold md:hover:text-[var(--white)] dark:md:hover:text-[var(--black)]'
                                >
                                    {item.name}
                                </a>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dropdown;

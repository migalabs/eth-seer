import React, { useState } from 'react';

// Types
type Props = {
    name: string;
    items: {
        name: string;
        route: string;
    }[];
};

const Dropdown = (props: Props) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleMenuOpen = () => {
        setIsOpen(true);
    };

    const handleMenuClose = () => {
        setIsOpen(false);
    };

    return (
        <div className='relative'>
            <button
                type='button'
                className='w-full text-xs uppercase text-white flex items-center'
                onMouseEnter={handleMenuOpen}
                onMouseLeave={handleMenuClose}
            >
                {props.name}
                <svg
                    className='w-3 h-3 ml-0.5'
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

            {isOpen && (
                <div className='absolute z-10 shadow-lg' onMouseEnter={handleMenuOpen} onMouseLeave={handleMenuClose}>
                    <div
                        className='p-1 rounded-lg bg-gray-200 border-2 border-gray-900'
                        role='menu'
                        aria-orientation='vertical'
                        aria-labelledby='options-menu'
                    >
                        {props.items.map(item => {
                            return (
                                <a
                                    key={item.name}
                                    href={`${item.route}`}
                                    className='rounded-lg block px-4 py-2 text-sm text-gray-500 hover:bg-white hover:text-gray-900'
                                    role='menuitem'
                                >
                                    {item.name}
                                </a>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dropdown;

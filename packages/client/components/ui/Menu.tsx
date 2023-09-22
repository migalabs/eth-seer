import { useState, useContext } from 'react';
import Link from 'next/link';

//Components
import Dropdown from './Dropdown';
import ThemeModeSwitch from './ThemeModeSwitch';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

const dropDownLists = {
    Explore: [
        {
            name: 'Epochs',
            route: '/epochs',
        },
        {
            name: 'Slots',
            route: '/slots',
        },
        {
            name: 'Entities',
            route: '/entities',
        },
        {
            name: 'Validators',
            route: '/validators',
        },
    ],
    Networks: [
        {
            name: 'Mainnet',
            route: 'https://ethseer.io',
        },
        {
            name: 'Goerli',
            route: 'https://ethseer.io/goerli',
        },
    ],
};

function Menu() {
    const [isOpen, setIsOpen] = useState(false);

    const { themeMode } = useContext(ThemeModeContext) ?? {};

    const handleMenuToggle = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className='flex flex-col md:flex-row md:justify-between md:items-center items-end py-2 px-4 md:p-0 z-50'>
            <div className='md:flex lg:items-center'>
                <button type='button' className='md:hidden absolute top-2 right-2 m-2' onClick={handleMenuToggle}>
                    <svg
                        className='w-8 h-8'
                        style={{color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)'}}
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                        xmlns='http://www.w3.org/2000/svg'
                    >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M4 6h16M4 12h16M4 18h16'
                        />
                    </svg>
                </button>
            </div>
            <ul
                className={`flex items-end absolute md:relative ${isOpen ? 'flex-col' : 'invisible'} md:visible
                }] md:bg-transparent md:flex-row md:gap-10 p-6 mt-10 md:mt-0 rounded-md border md:border-none`} 
                style={{ background: themeMode?.darkMode ? 'var(--bgDarkMode)' : 'var(--white)',
            borderColor: themeMode?.darkMode ? 'var(--white)': 'var(--black)'}}
            >
                <li
                    className='flex py-2 md:py-0'
                    style={{
                        color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                    }}
                >
                    <Link href='/' className='text-[14px] lg:text-[16px]'>
                        Home
                    </Link>
                </li>
                <li>
                    <Dropdown name='Explore' items={dropDownLists.Explore} />
                </li>
                <li>
                    <Dropdown name='Networks' items={dropDownLists.Networks} />
                </li>
            </ul>
            <div className='absolute right-14 md:right-0 md:relative md:pr-2'>
                <ThemeModeSwitch />
            </div>
        </div>
    );
}

export default Menu;

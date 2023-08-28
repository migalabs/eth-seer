import { useState } from 'react';
import Link from 'next/link';

//Components
import Dropdown from './Dropdown';
import ThemeModeSwitch from './ThemeModeSwitch';

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

    const handleMenuToggle = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className='flex flex-col md:flex-row md:justify-between md:items-center items-end py-2 px-4 md:p-0 z-50'>
            <div className='md:flex lg:items-center'>
                <button type='button' className='md:hidden absolute top-2 right-2 m-2' onClick={handleMenuToggle}>
                    <svg
                        className='w-8 h-8 text-white'
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
                className={`flex items-end absolute md:relative ${
                    isOpen ? 'flex-col' : 'invisible'
                } md:visible md:flex-row md:gap-10 p-6 mt-10 md:mt-0 bg-[#f2dc8e] md:bg-transparent border-4 rounded-lg border-[#9a7b2d] md:border-none`}
            >
                <li className='flex py-2 md:py-0'>
                    <Link href='/' className='text-xs uppercase text-[#9a7b2d] md:text-white'>
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

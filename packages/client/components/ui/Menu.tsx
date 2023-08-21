import { useState } from 'react';
import Link from 'next/link';

//Components
import Dropdown from './Dropdown';
import ThemeModeSwitch from '../ui/ThemeModeSwitch';
import SearchEngine from '../ui/SearchEngineBlack';

const dropDownLists = {
    Explore: [
        {
            name: 'Epochs',
            route: '/epochs',
        },
        {
            name: 'Entities',
            route: '/entities',
        },
        {
            name: 'Slots',
            route: '/slots',
        },
        {
            name: 'Validators',
            route: '/validators',
        },
    ],
    Networks: [
        {
            name: 'Mainnet',
            route: '/mainnet',
        },
        {
            name: 'Goerli',
            route: '/goerli',
        },
    ],
};

function Menu() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className='flex justify-center items-center'>
            <SearchEngine />
            <ul className='flex flex-row items-center gap-4 absolute top-8 right-36'>
                <li>
                    <Link href='/' className='text-xs uppercase text-white flex'>
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
            <ThemeModeSwitch />
        </div>
    );
}

export default Menu;

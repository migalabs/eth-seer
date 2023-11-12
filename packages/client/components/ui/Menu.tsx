import { useState, useContext, useEffect } from 'react';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

//Components
import Dropdown from './Dropdown';
import ThemeModeSwitch from './ThemeModeSwitch';
import NetworkLink from './NetworkLink';

// Constants
import axiosClient from '../../config/axios';

const Menu = () => {
    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};
    const [isOpen, setIsOpen] = useState(false);
    const [networks, setNetworks] = useState([]);

    useEffect(() => {
        if (networks.length === 0) {
            getNetworks();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleMenuToggle = () => {
        setIsOpen(!isOpen);
    };

    const getNetworks = async () => {
        try {
            const response = await axiosClient.get('/api/networks');
            setNetworks(response.data.networks);
        } catch (error) {
            console.log(error);
        }
    };

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
        Networks:
            networks.length > 0
                ? networks.map((network: string) => {
                      return {
                          name: network.charAt(0).toUpperCase() + network.slice(1),
                          route: `/?network=${network}`,
                      };
                  })
                : [],
    };

    return (
        <div className='flex flex-col md:flex-row md:justify-between md:items-center items-end py-2 px-4 md:p-0 z-50'>
            <div className='md:flex lg:items-center'>
                <button type='button' className='md:hidden absolute top-2 right-2 m-2' onClick={handleMenuToggle}>
                    <svg
                        className='w-8 h-8'
                        style={{ color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)' }}
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
                style={{
                    background: themeMode?.darkMode ? 'var(--bgDarkMode)' : 'var(--white)',
                    borderColor: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                }}
            >
                <li
                    className='flex py-2 md:py-0'
                    style={{
                        color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                    }}
                >
                    <NetworkLink href='/' className='text-[16px]'>
                        Home
                    </NetworkLink>
                </li>
                <li>
                    <Dropdown name='Explore' items={dropDownLists.Explore} useNetworkLink />
                </li>
                <li>
                    <Dropdown name='Networks' items={dropDownLists.Networks} />
                </li>
            </ul>
            <div className='relative right-8 md:right-0'>
                <ThemeModeSwitch />
            </div>
        </div>
    );
};

export default Menu;

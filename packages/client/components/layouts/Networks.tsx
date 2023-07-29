import React, { useContext, useState } from 'react';
import Link from 'next/link';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Components
import CustomImage from '../ui/CustomImage';

const Networks = () => {
    const assetPrefix = process.env.NEXT_PUBLIC_ASSET_PREFIX ?? '';

    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    // States
    const [network, setNetwork] = useState(false);

    const handleClick = () => {
        setNetwork(!network);
    };

    return (
        <div className='flex flex-col items-center relative z-20'>
            <div className='flex flex-col items-center cursor-pointer' onClick={handleClick}>
                <CustomImage
                    src={
                        themeMode?.darkMode
                            ? '/static/images/network-icon-dark.svg'
                            : '/static/images/network-icon-light.svg'
                    }
                    alt='Network Icon'
                    width={40}
                    height={40}
                />
                <p className='text-white text-xs'>{assetPrefix !== '/goerli' ? 'MAINNET' : 'GOERLI'}</p>
            </div>

            {network && (
                <div
                    className='absolute  mt-14 flex flex-col items-center w-fit  mx-auto gap-2 rounded-2xl bg-[#FFF0A1] p-4 text-xs '
                    style={{
                        backgroundColor: themeMode?.darkMode ? 'var(--yellow2)' : 'var(--blue1)',
                        boxShadow: themeMode?.darkMode ? 'var(--boxShadowYellow1)' : 'var(--boxShadowBlue1)',
                    }}
                >
                    {assetPrefix !== '/goerli' ? (
                        <Link href={`${process.env.NEXT_PUBLIC_NETWORK_URL}`} passHref>
                            <p className='cursor-pointer p-1  hover:bg-[#bdababa8] rounded-xl'>GOERLI</p>
                        </Link>
                    ) : (
                        <Link href={`${process.env.NEXT_PUBLIC_NETWORK_URL}`} passHref>
                            <p className='cursor-pointer p-1  hover:bg-[#bdababa8] rounded-xl'>MAINNET</p>
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
};

export default Networks;

import React from 'react';
import Link from 'next/link';

// Components
import CustomImage from '../ui/CustomImage';
import Menu from '../ui/Menu';
import SearchEngine from '../ui/SearchEngineBlack';

const Header = () => {
    return (
        <div className='flex justify-between'>
            <div className='w-fit'>
                <Link href='/' passHref>
                    <div className='flex flex-row justify-start items-center p-2'>
                        <CustomImage src='/static/images/ethseer_logo.svg' alt='Logo' width={50} height={50} />

                        <p className='uppercase text-white text-2xs md:text-xs mt-1 ml-2'>Ethseer.io</p>
                    </div>
                </Link>
            </div>
            <div className='flex flex-row gap-x-5 items-start mt-2.5'>
                <SearchEngine />
                <Menu />
            </div>
        </div>
    );
};

export default Header;

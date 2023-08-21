import React from 'react';
import Link from 'next/link';

// Components
import ThemeModeSwitch from '../ui/ThemeModeSwitch';
import CustomImage from '../ui/CustomImage';
import Networks from './Networks';

type Props = {
    isMain?: boolean;
};

const Header = ({ isMain }: Props) => {
    return (
        <div className='flex justify-between'>
            <div className='w-fit'>
                <Link href='/' passHref>
                    <div
                        className={`flex flex-row justify-start items-center p-2 ${
                            !isMain &&
                            'bg-[#D9D9D94D] rounded-2xl  border-2 border-white mt-2 ml-2 hover:bg-[#202021e3]'
                        }`}
                    >
                        <CustomImage
                            src='/static/images/icons/ethseer_logo.webp'
                            alt='Logo of Ethseer, an eye which contains Ethereum logo'
                            width={50}
                            height={50}
                        />

                        <p className='uppercase text-white text-2xs md:text-xs mt-1 ml-2'>Ethseer.io</p>
                    </div>
                </Link>
            </div>
            <div className='flex flex-row gap-x-5 items-start mt-2.5'>
                <Networks />
                <ThemeModeSwitch />
            </div>
        </div>
    );
};

export default Header;

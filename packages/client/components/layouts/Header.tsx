import React from 'react';
import Link from 'next/link';

// Components
import ThemeModeSwitch from '../ui/ThemeModeSwitch';
import CustomImage from '../ui/CustomImage';

type Props = {
    isMain?: boolean;
};

const Header = ({ isMain }: Props) => {
    return (
        <div className='flex justify-between'>
            <div className='w-fit'>
                <Link href='/' passHref>
                    <div
                        className={
                            isMain
                                ? 'flex flex-row justify-start items-center p-2'
                                : 'flex flex-row justify-start items-center p-2 bg-[#D9D9D94D] rounded-2xl  border-2 border-white mt-2 ml-2 hover:bg-[#202021e3]'
                        }
                    >
                        <CustomImage src='/static/images/ethseer_logo.svg' alt='Logo' width={50} height={50} />

                        <p className='uppercase text-white text-xs mt-1 ml-2'>
                            Ethseer <br /> Stats
                        </p>
                    </div>
                </Link>
            </div>

            <ThemeModeSwitch />
        </div>
    );
};

export default Header;

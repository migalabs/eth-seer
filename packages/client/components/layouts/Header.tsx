import Image from 'next/image';
import React from 'react';

const Header = () => {
    return (
        <div className='flex flex-row justify-start items-center p-2'>
            <Image src='/static/images/ethseer_logo.svg' alt='Logo' width={50} height={50} />

            <p className='uppercase text-white text-xs mt-1 ml-2'>
                Ethseer <br /> Stats
            </p>
        </div>
    );
};

export default Header;

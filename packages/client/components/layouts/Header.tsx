import Image from 'next/image';
import React from 'react';

type Props = {};

const Header = (props: Props) => {
    return (
        <div className='flex flex-row justify-start p-2'>
            <Image src='/static/images/panda-logo.svg' alt='Logo' width={50} height={50} />

            <p className='uppercase text-white text-base ml-2'>
                Panda <br /> Stats
            </p>
        </div>
    );
};

export default Header;

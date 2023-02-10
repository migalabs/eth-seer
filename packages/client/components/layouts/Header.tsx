import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Header = () => {
    return (
        <div className='w-fit'>
            <Link href='/' passHref>
                <div className='flex flex-row justify-start items-center p-2'>
                    <Image src='/static/images/ethseer_logo.svg' alt='Logo' width={50} height={50} />

                    <p className='uppercase text-white text-xs mt-1 ml-2'>
                        Ethseer <br /> Stats
                    </p>
                </div>
            </Link>
        </div>
    );
};

export default Header;

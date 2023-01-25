import React from 'react';
import Image from 'next/image';

const Problems = () => {
    return (
        <div className='flex flex-col gap-y-6 px-4 sm:px-14 max-w-[1200px] mx-auto h-screen justify-center'>
            <Image
                src='/static/images/big-logo.svg'
                alt='Big logo of Ethseer'
                width={700}
                height={700}
                className='mx-auto max-h-[70%]'
            />

            <p className='uppercase text-white text-center text-lg md:text-2xl'>
                Sorry, we're experiencing some problems with the server connection. Please try again in 5 minuts. Thank
                you.
            </p>
        </div>
    );
};

export default Problems;

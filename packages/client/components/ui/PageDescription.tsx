import React, { ReactNode } from 'react';

// Props
type Props = {
    children: ReactNode;
};

const PageDescription = ({ children }: Props) => {
    return (
        <div className='mx-auto mt-2 mb-5 py-4 px-6 border-2 border-white rounded-md w-11/12 xl:w-10/12 bg-[var(--bgMainLightMode)] dark:bg-[var(--bgDarkMode)]'>
            <h2 className='text-sm md:text-base xl:text-lg text-center text-black dark:text-white'>{children}</h2>
        </div>
    );
};

export default PageDescription;

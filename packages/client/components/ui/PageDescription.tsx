import React, { ReactNode } from 'react';

// Props
type Props = {
    children: ReactNode;
};

const PageDescription = ({ children }: Props) => {
    return (
        <div className='flex mx-auto py-4 px-6 border-2 border-[var(--purple)] rounded-md w-11/12 lg:w-10/12 bg-[var(--bgMainLightMode)] dark:bg-[var(--bgDarkMode)]'>
            <h2 className='text-[14px] 2xl:text-[18px] text-center leading-6 text-[var(--black)] dark:text-[var(--white)]'>
                {children}
            </h2>
        </div>
    );
};

export default PageDescription;

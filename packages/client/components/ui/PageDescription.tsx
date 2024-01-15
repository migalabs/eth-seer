import React, { ReactNode } from 'react';

// Props
type Props = {
    children: ReactNode;
};

const PageDescription = ({ children }: Props) => {
    return (
        <div className='mx-auto mt-2 mb-5 py-4 px-6 border-2 border-[var(--purple)] rounded-md w-11/12 xl:w-10/12 bg-[var(--bgMainLightMode)] dark:bg-[var(--bgDarkMode)]'>
            <h2 className='text-[14px] md:text-[16px] xl:text-[18px] text-center leading-6 text-[var(--black)] dark:text-[var(--white)]'>
                {children}
            </h2>
        </div>
    );
};

export default PageDescription;

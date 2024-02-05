import React from 'react';
import { XCircleIcon } from '@heroicons/react/24/outline';

// Props
type Props = {
    isVisible: boolean;
    children: React.ReactNode;
    onClose: () => void;
};

const FiltersMenu = ({ isVisible, children, onClose }: Props) => {
    return (
        <div
            className={`absolute top-[calc(100%+0.5rem)] right-0 ${
                isVisible ? 'flex' : 'hidden'
            } flex-col bg-[var(--white)] dark:bg-[var(--bgDarkMode)] border-2 border-[var(--black)] dark:border-[var(--white)] rounded-lg p-4 text-[var(--black)] dark:text-[var(--white)] text-[14px] dark:text-[16px] gap-y-4 w-[350px]`}
        >
            <div className='flex justify-between items-center gap-x-8'>
                <span className='text-[18px] md:text-[20px]'>Filters</span>

                <XCircleIcon strokeWidth={1.5} className='h-7 w-7 cursor-pointer' onClick={onClose} />
            </div>

            <div>{children}</div>

            <div className='flex gap-x-4 w-full justify-end'>
                <button className='whitespace-nowrap text-[var(--darkGray)] underline'>Clear all</button>
                <button className='text-sm px-4 py-1 bg-black text-white rounded-lg'>Apply</button>
            </div>
        </div>
    );
};

export default FiltersMenu;

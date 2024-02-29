import React from 'react';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

// Props
type Props = {
    onClick: () => void;
};

const FiltersButton = ({ onClick }: Props) => {
    return (
        <button
            className='flex items-center gap-x-2 bg-[var(--white)] dark:bg-[var(--bgDarkMode)] hover:bg-[var(--lightGray)] hover:dark:bg-[var(--lightGray)] border-2 border-[var(--black)] dark:border-[var(--white)] hover:border-[var(--white)] px-2 py-1 rounded-md font-normal text-[14px] md:text-[16px] text-[var(--black)] dark:text-[var(--white)] hover:text-[var(--white)]'
            onClick={onClick}
        >
            <span className='hidden sm:block font-medium'>Filters</span>
            <AdjustmentsHorizontalIcon strokeWidth={2} className='h-5 w-5' />
        </button>
    );
};

export default FiltersButton;

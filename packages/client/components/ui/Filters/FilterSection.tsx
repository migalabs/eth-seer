import React, { useState } from 'react';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline';

// Props
type Props = {
    header: string;
    removeSeparator?: boolean;
    children: React.ReactNode;
    onShowSectionChange?: (showSection: boolean) => void;
};

const FilterSection = ({ header, removeSeparator, children, onShowSectionChange }: Props) => {
    // States
    const [showSection, setShowSection] = useState(false);

    const handleClick = () => {
        setShowSection(!showSection);
        onShowSectionChange?.(!showSection);
    };

    return (
        <div className='flex flex-col bg-[var(--bgFilterSectionLight)] dark:bg-[var(--lightGray)]'>
            <div className='flex flex-col px-4 py-2'>
                <button className='flex justify-between cursor-pointer' onClick={handleClick}>
                    <span className='font-semibold'>{header}</span>

                    {showSection ? (
                        <MinusIcon strokeWidth={2} className='h-5 w-5' />
                    ) : (
                        <PlusIcon strokeWidth={2} className='h-5 w-5' />
                    )}
                </button>

                <div className={`${showSection ? 'flex' : 'hidden'} mt-2`}>{children}</div>
            </div>

            {!removeSeparator && <hr className='border-t-2 border-[var(--purple)]' />}
        </div>
    );
};

export default FilterSection;

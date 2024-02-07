import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

// Components
import CustomImage from '../CustomImage';
import FilterCheckbox from './FilterCheckbox';

// Types
type FilterCheckListCard = {
    name: string;
    imageUrl: string;
    imageAlt: string;
};

// Props
type Props = {
    options: FilterCheckListCard[];
};

const FilterCheckList = ({ options }: Props) => {
    // States
    const [selectedOptions, setSelectedOptions] = useState<FilterCheckListCard[]>([]);

    const handleClick = (option: FilterCheckListCard) => {
        if (selectedOptions.includes(option)) {
            setSelectedOptions(selectedOptions.filter(selectedOption => selectedOption !== option));
        } else {
            setSelectedOptions([...selectedOptions, option]);
        }
    };

    const handleRemoveOption = (option: FilterCheckListCard) => {
        setSelectedOptions(selectedOptions.filter(selectedOption => selectedOption !== option));
    };

    const handleSelectAll = (value: boolean) => {
        if (value) {
            setSelectedOptions(options);
        } else {
            setSelectedOptions([]);
        }
    };

    const getItemsCountText = () => {
        const itemsText = selectedOptions.length > 1 ? 'items' : 'item';

        return `${selectedOptions.length} ${itemsText} selected`;
    };

    return (
        <div className='flex flex-col gap-y-2 bg-white dark:bg-[var(--darkGray)] py-2 w-full'>
            <div className='flex flex-wrap gap-2 px-2 min-h-[24px] max-h-40 overflow-y-auto'>
                {selectedOptions.map(option => (
                    <button
                        key={option.name}
                        className='flex items-center gap-x-1 px-2 py-1 border-2 border-[var(--darkGray)] text-[var(--darkGray)] dark:bg-[var(--darkGray)] rounded-2xl text-sm text-[10px] md:text-[12px] bg-white dark:border-white dark:text-white'
                        onClick={() => handleRemoveOption(option)}
                    >
                        <span>{option.name}</span>

                        <XMarkIcon className='h-4 w-4' />
                    </button>
                ))}
            </div>

            <hr />

            <div className='px-2'>
                <FilterCheckbox label='Select All' onSelectRangeChange={handleSelectAll} />
            </div>

            <hr />

            <div className='flex flex-col items-start gap-y-3 max-h-40 px-2 overflow-y-auto'>
                {options.map(option => (
                    <button key={option.name} className='flex items-center gap-x-2' onClick={() => handleClick(option)}>
                        <input type='checkbox' checked={selectedOptions.includes(option)} className='cursor-pointer' />

                        <CustomImage
                            src={option.imageUrl}
                            alt={option.imageAlt}
                            width={30}
                            height={30}
                            className='w-[20px] h-[20px] md:w-[30px] md:h-[30px]'
                        />

                        {option.name}
                    </button>
                ))}
            </div>

            <hr />

            <div className='px-2'>
                <span>{getItemsCountText()}</span>
            </div>
        </div>
    );
};

export default FilterCheckList;

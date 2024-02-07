import React, { useState } from 'react';

// Components
import CustomImage from '../CustomImage';

// Types
type FilterOptionCard = {
    name: string;
    imageUrl: string;
    imageAlt: string;
};

// Props
type Props = {
    options: FilterOptionCard[];
    multipleChoice?: boolean;
};

const FilterOptionCardGroup = ({ options, multipleChoice }: Props) => {
    // States
    const [selectedOptions, setSelectedOptions] = useState<FilterOptionCard[]>([]);

    const handleClick = (option: FilterOptionCard) => {
        if (!multipleChoice) {
            if (selectedOptions.includes(option)) {
                setSelectedOptions([]);
            } else {
                setSelectedOptions([option]);
            }

            return;
        }

        if (selectedOptions.includes(option)) {
            setSelectedOptions(selectedOptions.filter(selectedOption => selectedOption !== option));
        } else {
            setSelectedOptions([...selectedOptions, option]);
        }
    };

    return (
        <div className='flex flex-wrap gap-2'>
            {options.map(option => (
                <button
                    key={option.name}
                    className={`flex items-center gap-x-2 px-2 py-1 border-2 ${
                        selectedOptions.includes(option)
                            ? 'border-black text-black dark:bg-[var(--bgStrongDarkMode)]'
                            : 'border-[var(--darkGray)] text-[var(--darkGray)] dark:bg-[var(--darkGray)]'
                    } text-[10px] md:text-[12px] bg-white dark:border-white dark:text-white`}
                    onClick={() => handleClick(option)}
                >
                    <CustomImage
                        src={option.imageUrl}
                        alt={option.imageAlt}
                        width={30}
                        height={30}
                        className='w-[20px] h-[20px] md:w-[30px] md:h-[30px]'
                    />
                    <span>{option.name.toUpperCase()}</span>
                </button>
            ))}
        </div>
    );
};

export default FilterOptionCardGroup;

import React, { useState } from 'react';

// Props
type Props = {
    options: string[];
    multipleChoice?: boolean;
};

const FilterOptionChipGroup = ({ options, multipleChoice }: Props) => {
    // States
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

    const handleClick = (option: string) => {
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
                    key={option}
                    className={`px-4 py-1 border-2 ${
                        selectedOptions.includes(option)
                            ? 'border-black text-black dark:bg-[var(--bgStrongDarkMode)]'
                            : 'border-[var(--darkGray)] text-[var(--darkGray)] dark:bg-[var(--darkGray)]'
                    } rounded-2xl text-[10px] md:text-[12px] bg-white dark:border-white dark:text-white`}
                    onClick={() => handleClick(option)}
                >
                    {option}
                </button>
            ))}
        </div>
    );
};

export default FilterOptionChipGroup;

import React, { useState, useEffect } from 'react';

// Props
type Props = {
    selectedOptions?: string[];
    options: string[];
    multipleChoice?: boolean;
    onSelectionChange?: (selectedOptions: string[]) => void;
};

const FilterOptionChipGroup = ({ selectedOptions, options, multipleChoice, onSelectionChange }: Props) => {
    // States
    const [currentSelectedOptions, setCurrentSelectedOptions] = useState<string[]>([]);

    useEffect(() => {
        if (selectedOptions) {
            const selectedOptionsNorm = selectedOptions.map(option => option.toLowerCase());
            setCurrentSelectedOptions(options.filter(option => selectedOptionsNorm.includes(option.toLowerCase())));
        } else {
            setCurrentSelectedOptions([]);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedOptions]);

    const handleClick = (option: string) => {
        let newSelectedOptions: string[] = [];

        if (multipleChoice) {
            if (currentSelectedOptions.includes(option)) {
                newSelectedOptions = currentSelectedOptions.filter(selectedOption => selectedOption !== option);
            } else {
                newSelectedOptions = [...currentSelectedOptions, option];
            }
        } else if (!currentSelectedOptions.includes(option)) {
            newSelectedOptions = [option];
        }

        setCurrentSelectedOptions(newSelectedOptions);
        onSelectionChange?.(newSelectedOptions);
    };

    return (
        <div className='flex flex-wrap gap-2'>
            {options.map(option => (
                <button
                    key={option}
                    className={`px-5 py-0.5 border-2 ${
                        currentSelectedOptions.includes(option)
                            ? 'border-black text-black dark:bg-[var(--bgStrongDarkMode)]'
                            : 'border-[var(--darkGray)] text-[var(--darkGray)] dark:bg-[var(--darkGray)]'
                    } rounded-full text-[10px] md:text-[12px] bg-white dark:border-white dark:text-white`}
                    onClick={() => handleClick(option)}
                >
                    {option}
                </button>
            ))}
        </div>
    );
};

export default FilterOptionChipGroup;

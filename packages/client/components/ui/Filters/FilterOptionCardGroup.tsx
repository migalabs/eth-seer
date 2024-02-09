import React, { useState, useEffect } from 'react';

// Components
import CustomImage from '../CustomImage';

// Types
import { FilterOptionCard } from '../../../types';

// Props
type Props = {
    selectedOptions?: FilterOptionCard[];
    options: FilterOptionCard[];
    multipleChoice?: boolean;
    onSelectionChange?: (selectedOptions: FilterOptionCard[]) => void;
};

const FilterOptionCardGroup = ({ selectedOptions, options, multipleChoice, onSelectionChange }: Props) => {
    // States
    const [currentSelectedOptions, setCurrentSelectedOptions] = useState<FilterOptionCard[]>([]);

    useEffect(() => {
        setCurrentSelectedOptions(
            selectedOptions ? options.filter(option => isOptionSelected(selectedOptions, option)) : []
        );

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedOptions]);

    const isOptionSelected = (source: FilterOptionCard[], item: FilterOptionCard) =>
        source.filter(x => x.name === item.name).length > 0;

    const handleClick = (option: FilterOptionCard) => {
        let newSelectedOptions: FilterOptionCard[] = [];

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
                    key={option.name}
                    className={`flex items-center gap-x-2 px-2 py-1 border-2 ${
                        isOptionSelected(currentSelectedOptions, option)
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

import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

// Props
type Props = {
    value?: number;
    onChange?: (value: number) => void;
};

const FilterNumericInput = ({ value, onChange }: Props) => {
    // States
    const [inputValue, setInputValue] = useState(0);

    useEffect(() => {
        setInputValue(value || 0);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.currentTarget.blur();
            return;
        }

        // Only allow digits
        if (e.key.length === 1 && !/\d/.test(e.key)) {
            e.preventDefault();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const normalizedString = e.target.value.replaceAll(',', '').replaceAll('.', '');

        setNewValue(Number(normalizedString));
    };

    const handleLeftArrow = () => {
        setNewValue(inputValue - 1);
    };

    const handleRightArrow = () => {
        setNewValue(inputValue + 1);
    };

    const setNewValue = (newValue: number) => {
        const validValue = getValidValue(newValue);
        setInputValue(validValue);
        onChange?.(validValue);
    };

    const getValidValue = (newValue: number) => {
        newValue = Math.min(9999999, newValue);
        newValue = Math.max(0, newValue);
        return newValue;
    };

    return (
        <div className='flex items-center gap-x-1 bg-white dark:bg-[var(--darkGray)] px-2 py-1'>
            <ChevronLeftIcon strokeWidth={2} className='cursor-pointer h-4 w-4' onClick={handleLeftArrow} />
            <input
                type='text'
                className='naked-number-input w-[70px] text-center bg-white dark:bg-[var(--darkGray)]'
                value={inputValue.toLocaleString()}
                onKeyDown={handleKeyDown}
                onChange={handleChange}
                onFocus={e => e.target.select()}
            />
            <ChevronRightIcon strokeWidth={2} className='cursor-pointer h-4 w-4' onClick={handleRightArrow} />
        </div>
    );
};

export default FilterNumericInput;

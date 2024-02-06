import React from 'react';

// Props
type Props = {
    value?: Date;
    onChange?: (value: Date) => void;
};

const FilterDateInput = ({ value, onChange }: Props) => {
    const format = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const date = new Date(e.target.value);

        if (isNaN(date.getTime())) {
            return;
        }

        onChange?.(date);
    };

    return (
        <input
            type='date'
            className='text-black dark:text-white bg-white dark:bg-[var(--darkGray)] px-2 py-1 text-[12px] md:text-[14px] w-[126px]'
            value={format(value ?? new Date())}
            onChange={handleDateChange}
        />
    );
};

export default FilterDateInput;

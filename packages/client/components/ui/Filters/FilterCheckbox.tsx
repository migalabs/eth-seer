import React, { useState, useEffect } from 'react';

// Props
type Props = {
    label: string;
    checked?: boolean;
    onSelectRangeChange?: (value: boolean) => void;
};

const FilterCheckbox = ({ label, checked, onSelectRangeChange }: Props) => {
    // States
    const [checkboxName, setCheckboxName] = useState('');

    useEffect(() => {
        if (!checkboxName) {
            setCheckboxName(`cbxSelectRange#${Math.random()}`);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className='flex item-center gap-x-1'>
            <input
                id={checkboxName}
                type='checkbox'
                checked={checked}
                onChange={e => onSelectRangeChange?.(e.target.checked)}
            />
            <label htmlFor={checkboxName} className='select-none'>
                {label}
            </label>
        </div>
    );
};

export default FilterCheckbox;

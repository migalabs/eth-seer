import React, { useState, useEffect } from 'react';

// Props
type Props = {
    onSelectRangeChange?: (value: boolean) => void;
};

const FilterSelectRangeCheckbox = ({ onSelectRangeChange }: Props) => {
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
            <input id={checkboxName} type='checkbox' onChange={e => onSelectRangeChange?.(e.target.checked)} />
            <label htmlFor={checkboxName} className='select-none'>
                Select Range
            </label>
        </div>
    );
};

export default FilterSelectRangeCheckbox;

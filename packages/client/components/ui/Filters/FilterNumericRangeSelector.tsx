import React, { useState } from 'react';
import { MinusIcon } from '@heroicons/react/24/outline';

// Components
import FilterNumericInput from './FilterNumericInput';
import FilterSelectRangeCheckbox from './FilterCheckbox';

// Props
type Props = {
    allowRangeSelection?: boolean;
    onValueChange?: (value: number) => void;
    onRangeChange?: (from: number, to: number) => void;
};

const FilterNumericRangeSelector = ({ allowRangeSelection, onValueChange, onRangeChange }: Props) => {
    // States
    const [singleValue, setSingleValue] = useState(0);
    const [lowerBound, setLowerBound] = useState(0);
    const [upperBound, setUpperBound] = useState(0);
    const [showRangeSelector, setShowRangeSelector] = useState(false);

    const handleSingleValueChange = (value: number) => {
        setSingleValue(value);
        onValueChange?.(value);
    };

    const handleLowerBoundChange = (value: number) => {
        setLowerBound(value);
        if (upperBound < value) {
            setUpperBound(value);
            onRangeChange?.(value, value);
        } else {
            onRangeChange?.(value, upperBound);
        }
    };

    const handleUpperBoundChange = (value: number) => {
        setUpperBound(value);
        if (value < lowerBound) {
            setLowerBound(value);
            onRangeChange?.(value, value);
        } else {
            onRangeChange?.(lowerBound, value);
        }
    };

    return (
        <div className='flex flex-col gap-y-2'>
            {allowRangeSelection && (
                <FilterSelectRangeCheckbox label='Select Range' onSelectRangeChange={setShowRangeSelector} />
            )}

            {showRangeSelector ? (
                <div className='flex gap-x-2'>
                    <div className='flex flex-col gap-y-1 items-center'>
                        <span className='select-none'>From</span>
                        <FilterNumericInput value={lowerBound} onChange={handleLowerBoundChange} />
                    </div>
                    <MinusIcon className='h-5 w-5 self-end mb-1.5' />
                    <div className='flex flex-col gap-y-1 items-center'>
                        <span className='select-none'>To</span>
                        <FilterNumericInput value={upperBound} onChange={handleUpperBoundChange} />
                    </div>
                </div>
            ) : (
                <FilterNumericInput value={singleValue} onChange={handleSingleValueChange} />
            )}
        </div>
    );
};

export default FilterNumericRangeSelector;

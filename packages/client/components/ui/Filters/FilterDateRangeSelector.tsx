import React, { useState } from 'react';
import { MinusIcon } from '@heroicons/react/24/outline';

// Components
import FilterSelectRangeCheckbox from './FilterSelectRangeCheckbox';
import FilterDateInput from './FilterDateInput';

// Props
type Props = {
    allowRangeSelection?: boolean;
    onValueChange?: (value: Date) => void;
    onRangeChange?: (from: Date, to: Date) => void;
};

const FilterDateRangeSelector = ({ allowRangeSelection, onValueChange, onRangeChange }: Props) => {
    // States
    const [singleValue, setSingleValue] = useState(new Date());
    const [lowerBound, setLowerBound] = useState(new Date());
    const [upperBound, setUpperBound] = useState(new Date());
    const [showRangeSelector, setShowRangeSelector] = useState(false);

    const handleSingleValueChange = (value: Date) => {
        setSingleValue(value);
        onValueChange?.(value);
    };

    const handleLowerBoundChange = (value: Date) => {
        setLowerBound(value);
        if (upperBound < value) {
            setUpperBound(value);
            onRangeChange?.(value, value);
        } else {
            onRangeChange?.(value, upperBound);
        }
    };

    const handleUpperBoundChange = (value: Date) => {
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
            {allowRangeSelection && <FilterSelectRangeCheckbox onSelectRangeChange={setShowRangeSelector} />}

            {showRangeSelector ? (
                <div className='flex gap-x-2'>
                    <div className='flex flex-col gap-y-1 items-center'>
                        <span className='select-none'>From</span>
                        <FilterDateInput value={lowerBound} onChange={handleLowerBoundChange} />
                    </div>
                    <MinusIcon className='h-5 w-5 self-end mb-1.5' />
                    <div className='flex flex-col gap-y-1 items-center'>
                        <span className='select-none'>To</span>
                        <FilterDateInput value={upperBound} onChange={handleUpperBoundChange} />
                    </div>
                </div>
            ) : (
                <FilterDateInput value={singleValue} onChange={handleSingleValueChange} />
            )}
        </div>
    );
};

export default FilterDateRangeSelector;

import React, { useState, useEffect } from 'react';
import { MinusIcon } from '@heroicons/react/24/outline';

// Components
import FilterNumericInput from './FilterNumericInput';
import FilterSelectRangeCheckbox from './FilterCheckbox';

// Types
import { Range } from '../../../types';

// Props
type Props = {
    value?: number | Range<number>;
    allowRangeSelection?: boolean;
    onValueChange?: (value: number | Range<number>) => void;
};

const FilterNumericRangeSelector = ({ value, allowRangeSelection, onValueChange }: Props) => {
    // States
    const [singleValue, setSingleValue] = useState(0);
    const [rangeValue, setRangeValue] = useState<Range<number>>({ lower: 0, upper: 0 });
    const [showRangeSelector, setShowRangeSelector] = useState(false);

    useEffect(() => {
        if (typeof value === 'number') {
            setSingleValue(value);
            setShowRangeSelector(false);
        } else if (value) {
            setRangeValue(value);
            setShowRangeSelector(true);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const handleSingleValueChange = (newValue: number) => {
        setSingleValue(newValue);
        onValueChange?.(newValue);
    };

    const handleLowerBoundChange = (newValue: number) => {
        const newRangeValue = { lower: newValue, upper: rangeValue.upper < newValue ? newValue : rangeValue.upper };
        setRangeValue(newRangeValue);
        onValueChange?.(newRangeValue);
    };

    const handleUpperBoundChange = (newValue: number) => {
        const newRangeValue = { lower: rangeValue.lower > newValue ? newValue : rangeValue.lower, upper: newValue };
        setRangeValue(newRangeValue);
        onValueChange?.(newRangeValue);
    };

    const handleSelectRangeChange = (value: boolean) => {
        if (value) {
            onValueChange?.(rangeValue);
        } else {
            onValueChange?.(singleValue);
        }

        setShowRangeSelector(value);
    };

    return (
        <div className='flex flex-col gap-y-2'>
            {allowRangeSelection && (
                <FilterSelectRangeCheckbox
                    label='Select Range'
                    checked={showRangeSelector}
                    onSelectRangeChange={handleSelectRangeChange}
                />
            )}

            {showRangeSelector ? (
                <div className='flex gap-x-2'>
                    <div className='flex flex-col gap-y-1 items-center'>
                        <span className='select-none'>From</span>
                        <FilterNumericInput value={rangeValue.lower} onChange={handleLowerBoundChange} />
                    </div>
                    <MinusIcon className='h-5 w-5 self-end mb-1.5' />
                    <div className='flex flex-col gap-y-1 items-center'>
                        <span className='select-none'>To</span>
                        <FilterNumericInput value={rangeValue.upper} onChange={handleUpperBoundChange} />
                    </div>
                </div>
            ) : (
                <FilterNumericInput value={singleValue} onChange={handleSingleValueChange} />
            )}
        </div>
    );
};

export default FilterNumericRangeSelector;

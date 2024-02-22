import React, { useState, useEffect } from 'react';
import { MinusIcon } from '@heroicons/react/24/outline';

// Components
import FilterSelectRangeCheckbox from './FilterCheckbox';
import FilterDateInput from './FilterDateInput';

// Types
import { Range } from '../../../types';

// Props
type Props = {
    value?: Date | Range<Date>;
    allowRangeSelection?: boolean;
    onValueChange?: (value: Date | Range<Date>) => void;
};

const FilterDateRangeSelector = ({ value, allowRangeSelection, onValueChange }: Props) => {
    // States
    const [singleValue, setSingleValue] = useState(new Date());
    const [rangeValue, setRangeValue] = useState<Range<Date>>({ lower: new Date(), upper: new Date() });
    const [showRangeSelector, setShowRangeSelector] = useState(false);

    useEffect(() => {
        if (value instanceof Date) {
            setSingleValue(value);
            setShowRangeSelector(false);
        } else if (value) {
            setRangeValue(value);
            setShowRangeSelector(true);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const handleSingleValueChange = (newValue: Date) => {
        setSingleValue(newValue);
        onValueChange?.(newValue);
    };

    const handleLowerBoundChange = (newValue: Date) => {
        const newRangeValue = { lower: newValue, upper: rangeValue.upper < newValue ? newValue : rangeValue.upper };
        setRangeValue(newRangeValue);
        onValueChange?.(newRangeValue);
    };

    const handleUpperBoundChange = (newValue: Date) => {
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
                        <FilterDateInput value={rangeValue.lower} onChange={handleLowerBoundChange} />
                    </div>
                    <MinusIcon className='h-5 w-5 self-end mb-1.5' />
                    <div className='flex flex-col gap-y-1 items-center'>
                        <span className='select-none'>To</span>
                        <FilterDateInput value={rangeValue.upper} onChange={handleUpperBoundChange} />
                    </div>
                </div>
            ) : (
                <FilterDateInput value={singleValue} onChange={handleSingleValueChange} />
            )}
        </div>
    );
};

export default FilterDateRangeSelector;

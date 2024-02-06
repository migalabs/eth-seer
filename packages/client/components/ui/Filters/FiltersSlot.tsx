import React from 'react';

// Components
import FiltersContainer from './FiltersContainer';
import FilterSection from './FilterSection';
import FilterOptionChipGroup from './FilterOptionChipGroup';
import FilterNumericRangeSelector from './FilterNumericRangeSelector';
import FilterDateRangeSelector from './FilterDateRangeSelector';

const FiltersSlot = () => {
    return (
        <FiltersContainer>
            <FilterSection header='Status'>
                <FilterOptionChipGroup options={['Proposed', 'Missed', 'Orphan']} />
            </FilterSection>

            <FilterSection header='Epoch'>
                <FilterNumericRangeSelector allowRangeSelection />
            </FilterSection>

            <FilterSection header='Proposer'>
                <FilterNumericRangeSelector />
            </FilterSection>

            <FilterSection header='Date'>
                <FilterDateRangeSelector allowRangeSelection />
            </FilterSection>

            <FilterSection header='Entity'>
                <div>Filter Entity</div>
            </FilterSection>

            <FilterSection header='CL Client' removeSeparator>
                <div>Filter CL Client</div>
            </FilterSection>
        </FiltersContainer>
    );
};

export default FiltersSlot;

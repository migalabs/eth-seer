import React from 'react';

// Components
import FiltersContainer from './FiltersContainer';
import FilterSection from './FilterSection';
import FilterOptionChipGroup from './FilterOptionChipGroup';

const FiltersSlot = () => {
    return (
        <FiltersContainer>
            <FilterSection header='Status'>
                <FilterOptionChipGroup options={['Proposed', 'Missed', 'Orphan']} />
            </FilterSection>

            <FilterSection header='Epoch'>
                <div>Filter Epoch</div>
            </FilterSection>

            <FilterSection header='Proposer'>
                <div>Filter Proposer</div>
            </FilterSection>

            <FilterSection header='Date'>
                <div>Filter Date</div>
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

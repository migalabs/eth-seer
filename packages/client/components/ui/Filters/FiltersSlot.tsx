import React from 'react';

// Components
import FiltersContainer from './FiltersContainer';
import FilterSection from './FilterSection';
import FilterOptionChipGroup from './FilterOptionChipGroup';
import FilterNumericRangeSelector from './FilterNumericRangeSelector';
import FilterDateRangeSelector from './FilterDateRangeSelector';
import FilterOptionCardGroup from './FilterOptionCardGroup';
import FilterCheckList from './FilterCheckList';

// Helpers
import {
    getImageUrlEntity,
    getImageAltEntity,
    getImageUrlClient,
    getImageAltClient,
} from '../../../helpers/imageUrlsHelper';

// Constants
import { POOLS, CLIENTS } from '../../../constants';

const FiltersSlot = () => {
    const poolsCardItems = POOLS.map(pool => ({
        name: pool,
        imageUrl: getImageUrlEntity(pool),
        imageAlt: getImageAltEntity(pool),
    }));

    const clientCardItems = CLIENTS.map(client => ({
        name: client.name,
        imageUrl: getImageUrlClient(client.name),
        imageAlt: getImageAltClient(client.name),
    }));

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
                <FilterCheckList options={poolsCardItems} />
            </FilterSection>

            <FilterSection header='CL Client' removeSeparator>
                <FilterOptionCardGroup options={clientCardItems} multipleChoice />
            </FilterSection>
        </FiltersContainer>
    );
};

export default FiltersSlot;

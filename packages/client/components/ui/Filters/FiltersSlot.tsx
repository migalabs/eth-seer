import React, { useState } from 'react';

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

// Types
import { Range, FilterCheckListCard, FilterOptionCard, FiltersSlot as FiltersSlotType } from '../../../types';

// Constants
import { POOLS, CLIENTS } from '../../../constants';

// Props
type Props = {
    onChangeFilters?: (filters: FiltersSlotType) => void;
};

const FiltersSlot = ({ onChangeFilters }: Props) => {
    // Pool Cards
    const poolsCardItems = POOLS.map(pool => ({
        name: pool,
        imageUrl: getImageUrlEntity(pool),
        imageAlt: getImageAltEntity(pool),
    }));

    // Client Cards
    const clientCardItems = CLIENTS.map(client => ({
        name: client.name,
        imageUrl: getImageUrlClient(client.name),
        imageAlt: getImageAltClient(client.name),
    }));

    // States
    const [status, setStatus] = useState<string | undefined>(undefined);
    const [epoch, setEpoch] = useState<number | Range<number>>(0);
    const [validator, setValidator] = useState<number>(0);
    const [date, setDate] = useState<Date | Range<Date>>(new Date());
    const [entities, setEntities] = useState<FilterCheckListCard[]>([]);
    const [clients, setClients] = useState<FilterOptionCard[]>([]);
    const [filterStatus, setFilterStatus] = useState(false);
    const [filterEpoch, setFilterEpoch] = useState(false);
    const [filterValidator, setFilterValidator] = useState(false);
    const [filterDate, setFilterDate] = useState(false);
    const [filterEntity, setFilterEntity] = useState(false);
    const [filterClient, setFilterClient] = useState(false);

    const handleStatusChange = (status: string[]) => {
        setStatus(status.length > 0 ? status[0] : undefined);
    };

    const handleEpochChange = (value: number | Range<number>) => {
        setEpoch(value);
    };

    const handleValidatorChange = (value: number | Range<number>) => {
        if (typeof value === 'number') {
            setValidator(value);
        }
    };

    const handleDateChange = (value: Date | Range<Date>) => {
        setDate(value);
    };

    const handleApply = () => {
        const filters: FiltersSlotType = {};

        // Status
        if (filterStatus && status) filters.status = status;

        // Epoch
        if (filterEpoch) {
            if (typeof epoch === 'number') {
                filters.epoch = epoch;
            } else {
                filters.lowerEpoch = epoch.lower;
                filters.upperEpoch = epoch.upper;
            }
        }

        // Validator
        if (filterValidator) filters.validator = validator;

        // Date
        if (filterDate) {
            if (date instanceof Date) {
                const minDate = new Date(date);
                minDate.setHours(0, 0, 0, 0);

                const maxDate = new Date(date);
                maxDate.setHours(23, 59, 59, 999);

                filters.lowerDate = minDate.toISOString();
                filters.upperDate = maxDate.toISOString();
            } else {
                const minDate = new Date(date.lower);
                minDate.setHours(0, 0, 0, 0);

                const maxDate = new Date(date.upper);
                maxDate.setHours(23, 59, 59, 999);

                filters.lowerDate = minDate.toISOString();
                filters.upperDate = maxDate.toISOString();
            }
        }

        // Entities
        if (filterEntity && entities.length > 0) filters.entities = entities.map(entity => entity.name);

        // Clients
        if (filterClient && clients.length > 0) filters.clients = clients.map(client => client.name);

        onChangeFilters?.(filters);
    };

    const handleClearAll = () => {
        setStatus(undefined);
        setEpoch({ lower: 0, upper: 0 });
        setValidator(0);
        setDate({ lower: new Date(), upper: new Date() });
        setEntities([]);
        setClients([]);

        setTimeout(() => {
            setEpoch(0);
            setDate(new Date());
        }, 0);
    };

    return (
        <FiltersContainer onApply={handleApply} onClearAll={handleClearAll}>
            <FilterSection header='Status' onShowSectionChange={setFilterStatus}>
                <FilterOptionChipGroup
                    selectedOptions={status ? [status] : []}
                    options={['Proposed', 'Missed', 'Orphan']}
                    onSelectionChange={handleStatusChange}
                />
            </FilterSection>

            <FilterSection header='Epoch' onShowSectionChange={setFilterEpoch}>
                <FilterNumericRangeSelector value={epoch} allowRangeSelection onValueChange={handleEpochChange} />
            </FilterSection>

            <FilterSection header='Proposer' onShowSectionChange={setFilterValidator}>
                <FilterNumericRangeSelector value={validator} onValueChange={handleValidatorChange} />
            </FilterSection>

            <FilterSection header='Date' onShowSectionChange={setFilterDate}>
                <FilterDateRangeSelector value={date} allowRangeSelection onValueChange={handleDateChange} />
            </FilterSection>

            <FilterSection header='Entity' onShowSectionChange={setFilterEntity}>
                <FilterCheckList selectedOptions={entities} options={poolsCardItems} onSelectionChange={setEntities} />
            </FilterSection>

            <FilterSection header='CL Client' removeSeparator onShowSectionChange={setFilterClient}>
                <FilterOptionCardGroup
                    selectedOptions={clients}
                    options={clientCardItems}
                    multipleChoice
                    onSelectionChange={setClients}
                />
            </FilterSection>
        </FiltersContainer>
    );
};

export default FiltersSlot;

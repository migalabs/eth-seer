import React, { useState, Fragment, useContext } from 'react';
import Link from 'next/link';

// Context
import BlocksContext from '../../contexts/blocks/BlocksContext';
import EpochsContext from '../../contexts/epochs/EpochsContext';

// Components
import CustomImage from './CustomImage';

// Types
type SearchEngineItem = {
    label: string;
    link: string;
};

const SearchEngine = () => {
    // States
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState<SearchEngineItem[]>([]);

    // Blocks Context
    const { blocks } = useContext(BlocksContext) || {};

    // Epochs Context
    const { epochs } = useContext(EpochsContext) || {};

    const loadResults = (searchContent: string) => {
        if (searchContent.length === 0) {
            setSearchResults([]);
            return;
        }

        const items: SearchEngineItem[] = [];

        if (!isNaN(Number(searchContent))) {
            const searchContentNumber = Number(searchContent);

            const lastEpoch = getLastEpoch();

            if (searchContentNumber >= 0 && searchContentNumber <= lastEpoch) {
                // It can be an epoch
                items.push({
                    label: `Epoch: ${searchContent}`,
                    link: `/epoch/${searchContent}`,
                });
            }

            const lastBlock = getLastBlock();

            if (searchContentNumber >= 0 && searchContentNumber <= lastBlock) {
                // It can be a slot
                items.push({
                    label: `Slot: ${searchContent}`,
                    link: `/slot/${searchContent}`,
                });
            }

            if (searchContentNumber >= 0 && searchContentNumber <= 2147483647) {
                // It can be a validator
                items.push({
                    label: `Validator: ${searchContent}`,
                    link: `/validator/${searchContent}`,
                });
            }
        }

        setSearchResults(items);
    };

    const getLastBlock = () => {
        if (!blocks || !blocks.epochs) {
            return 0;
        }

        const lastEpoch: number = Math.max(...Object.keys(blocks.epochs).map(epoch => parseInt(epoch)));
        const lastBlock: number = blocks.epochs[lastEpoch][blocks.epochs[lastEpoch].length - 1].f_slot;

        return lastBlock;
    };

    const getLastEpoch = () => {
        if (!epochs || !epochs.epochs) {
            return 0;
        }

        const lastEpoch: number = Math.max(...epochs.epochs.map(epoch => epoch.f_epoch));

        return lastEpoch;
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        loadResults(e.target.value.trim());
    };

    return (
        <div className='absolute flex top-4 left-[calc(50%-210px)] items-center w-[420px] h-10 border-2 border-[var(--yellow2)] rounded-3xl py-1 bg-[var(--yellow5)]'>
            <CustomImage
                src={'/static/images/magnifying-glass-pixel.svg'}
                alt='Magnifying Glass Pixel'
                width={30}
                height={30}
                className='ml-2 mt-1'
            />

            <input
                type='text'
                className='w-full h-full bg-transparent text-sm m-2 placeholder-[var(--yellow2)] text-[var(--yellow2)] outline-none'
                placeholder='Search by Epoch / Slot'
                value={search}
                onChange={handleSearch}
            />

            {searchResults.length > 0 && (
                <div className='absolute flex flex-col top-full left-0 gap-y-3 w-full border-2 border-[var(--yellow2)] rounded-xl p-5 bg-[var(--yellow6)] text-[var(--yellow2)] text-xs z-10'>
                    {searchResults.map((item, index) => (
                        <Fragment key={index}>
                            <Link href={item.link} passHref>
                                <span>{item.label}</span>
                            </Link>

                            {index !== searchResults.length - 1 && (
                                <div className='border-b border-[var(--yellow2)]'></div>
                            )}
                        </Fragment>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchEngine;
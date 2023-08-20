import React, { useState, Fragment, useContext, useRef } from 'react';
import Link from 'next/link';
import styled from '@emotion/styled';

// Context
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';
import BlocksContext from '../../contexts/blocks/BlocksContext';
import EpochsContext from '../../contexts/epochs/EpochsContext';

// Hooks
import useOutsideClick from '../../hooks/useOutsideClick';

// Components
import CustomImage from './CustomImage';

// Constants
import { POOLS_EXTENDED } from '../../constants';

// Styled
type PropsInput = {
    darkMode: boolean;
};

const SearchEngineInput = styled.input<PropsInput>`
    color: ${props => (props.darkMode ? 'var(--yellow4)' : 'var(--blue2)')};

    ::placeholder {
        /* Chrome, Firefox, Opera, Safari 10.1+ */
        color: ${props => (props.darkMode ? 'var(--yellow4)' : 'var(--blue2)')};
        opacity: 1; /* Firefox */
    }

    :-ms-input-placeholder {
        /* Internet Explorer 10-11 */
        color: ${props => (props.darkMode ? 'var(--yellow4)' : 'var(--blue2)')};
    }

    ::-ms-input-placeholder {
        /* Microsoft Edge */
        color: ${props => (props.darkMode ? 'var(--yellow4)' : 'var(--blue2)')};
    }
`;

// Types
type SearchEngineItem = {
    label: string;
    link: string;
};

const SearchEngineBlack = () => {
    const assetPrefix = process.env.NEXT_PUBLIC_ASSET_PREFIX ?? '';

    // Theme Mode Context
    const { themeMode } = React.useContext(ThemeModeContext) ?? {};

    // Blocks Context
    const { blocks } = useContext(BlocksContext) ?? {};

    // Epochs Context
    const { epochs } = useContext(EpochsContext) ?? {};

    // Refs
    const popUpRef = useRef<HTMLDivElement>(null);

    // Hook Outside Click
    useOutsideClick(popUpRef, () => setShowResults(false));

    // States
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState<SearchEngineItem[]>([]);
    const [showResults, setShowResults] = useState(true);

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
                    link: `/epochs/${searchContent}`,
                });
            }

            const lastBlock = getLastBlock();

            if (searchContentNumber >= 0 && searchContentNumber <= lastBlock) {
                // It can be a slot
                items.push({
                    label: `Slot: ${searchContent}`,
                    link: `/slots/${searchContent}`,
                });
            }

            if (searchContentNumber >= 0 && searchContentNumber <= 2147483647) {
                // It can be a validator
                items.push({
                    label: `Validator: ${searchContent}`,
                    link: `/validators/${searchContent}`,
                });
            }

            if (searchContent.length >= 3) {
                // It can be a graffiti
                items.push({
                    label: `Graffiti: ${searchContent}`,
                    link: `/slots/graffitis/${searchContent}`,
                });
            }
        } else {
            if (searchContent.length >= 3) {
                // It can be a graffiti
                items.push({
                    label: `Graffiti: ${searchContent}`,
                    link: `/slots/graffitis/${searchContent}`,
                });
            }

            // It can be an entity
            const expression = new RegExp(searchContent, 'i');

            if (assetPrefix === '/goerli') {
                items.push(
                    ...['OTHERS']
                        .filter(pool => pool.search(expression) !== -1)
                        .map(pool => ({
                            label: `Entity: ${pool}`,
                            link: `/entities/${pool.toLowerCase()}`,
                        }))
                );
            } else {
                items.push(
                    ...POOLS_EXTENDED.sort((a, b) => (a > b ? 1 : -1))
                        .filter(pool => pool.search(expression) !== -1)
                        .map(pool => ({
                            label: `Entity: ${pool}`,
                            link: `/entities/${pool.toLowerCase()}`,
                        }))
                );
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
        setShowResults(true);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
            setShowResults(false);
        }
    };

    return (
        <div
            className='absolute flex top-20 md:top-4 left-4 md:left-[calc(50%-210px)] items-center w-[calc(100%-2rem)] md:w-[420px] h-10 border-2 rounded-3xl py-1 bg-[#736a73]'
            style={{
                borderColor: themeMode?.darkMode ? 'var(--yellow4)' : 'var(--blue2)',
                color: themeMode?.darkMode ? 'var(--yellow4)' : 'var(--blue2)',
            }}
            ref={popUpRef}
        >
            <CustomImage
                src={'/static/images/icons/magnifying_glass_icon.webp'}
                alt='Magnifying Glass Pixel'
                width={25}
                height={25}
                className='ml-2'
            />

            <SearchEngineInput
                type='text'
                className='w-full h-full bg-transparent text-sm m-2 outline-none'
                placeholder='Search'
                value={search}
                onChange={handleSearch}
                darkMode={themeMode?.darkMode ?? false}
                onKeyDown={handleKeyDown}
            />

            {searchResults.length > 0 && showResults && (
                <div
                    className='absolute top-full left-0 border-2 rounded-xl p-1 bg-[#736a73] z-[var(--zIndexSearchEngine)] w-full'
                    style={{
                        borderColor: themeMode?.darkMode ? 'var(--yellow4)' : 'var(--blue2)',
                        color: themeMode?.darkMode ? 'var(--yellow4)' : 'var(--blue2)',
                    }}
                >
                    <div
                        className={`flex flex-col gap-y-3 w-full px-4 py-4 text-xs max-h-[400px] overflow-y-scroll scrollbar-thin ${
                            themeMode?.darkMode ? 'scrollbar-thumb-[#f0c83a]' : 'scrollbar-thumb-[#6cc4e0]'
                        } scrollbar-track-[#736a73] scrollbar-thumb-rounded`}
                    >
                        {searchResults.map((item, index) => (
                            <Fragment key={index}>
                                <Link href={item.link} passHref>
                                    <span>{item.label}</span>
                                </Link>

                                {index !== searchResults.length - 1 && (
                                    <div
                                        className='border-b'
                                        style={{
                                            borderColor: themeMode?.darkMode ? 'var(--yellow4)' : 'var(--blue2)',
                                        }}
                                    ></div>
                                )}
                            </Fragment>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchEngineBlack;

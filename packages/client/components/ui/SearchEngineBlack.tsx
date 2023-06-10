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
    // Theme Mode Context
    const { themeMode } = React.useContext(ThemeModeContext) || {};

    // Blocks Context
    const { blocks } = useContext(BlocksContext) || {};

    // Epochs Context
    const { epochs } = useContext(EpochsContext) || {};

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

            if (searchContent.length >= 3) {
                // It can be a graffiti
                items.push({
                    label: `Graffiti: ${searchContent}`,
                    link: `/slot/graffiti/${searchContent}`,
                });
            }
        } else {
            if (searchContent.length >= 3) {
                // It can be a graffiti
                items.push({
                    label: `Graffiti: ${searchContent}`,
                    link: `/slot/graffiti/${searchContent}`,
                });
            }

            // It can be an entity
            const expression = new RegExp(searchContent, 'i');

            if (process.env.NEXT_PUBLIC_ASSET_PREFIX?.toUpperCase() === 'GOERLI') {
                items.push(
                    ...['OTHERS']
                        .filter(pool => pool.search(expression) !== -1)
                        .map(pool => ({
                            label: `Entity: ${pool}`,
                            link: `/entity/${pool.toLowerCase()}`,
                        }))
                );
            } else {
                items.push(
                    ...POOLS_EXTENDED.sort((a, b) => (a > b ? 1 : -1))
                        .filter(pool => pool.search(expression) !== -1)
                        .slice(0, 10)
                        .map(pool => ({
                            label: `Entity: ${pool}`,
                            link: `/entity/${pool.toLowerCase()}`,
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
                src={'/static/images/magnifying-glass-pixel.svg'}
                alt='Magnifying Glass Pixel'
                width={30}
                height={30}
                className='ml-2 mt-1'
            />

            <SearchEngineInput
                type='text'
                className='w-full h-full bg-transparent text-sm m-2 outline-none'
                placeholder='Search'
                value={search}
                onChange={handleSearch}
                darkMode={themeMode?.darkMode || false}
                onKeyDown={handleKeyDown}
            />

            {searchResults.length > 0 && showResults && (
                <div
                    className='absolute flex flex-col top-full left-0 gap-y-3 w-full border-2 rounded-xl p-5 bg-[#736a73] text-xs z-10'
                    style={{
                        borderColor: themeMode?.darkMode ? 'var(--yellow4)' : 'var(--blue2)',
                        color: themeMode?.darkMode ? 'var(--yellow4)' : 'var(--blue2)',
                    }}
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
            )}
        </div>
    );
};

export default SearchEngineBlack;

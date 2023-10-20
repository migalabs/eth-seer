import React, { useState, Fragment, useContext, useRef } from 'react';
import styled from '@emotion/styled';

// Context
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';
import BlocksContext from '../../contexts/blocks/BlocksContext';
import EpochsContext from '../../contexts/epochs/EpochsContext';

// Hooks
import useOutsideClick from '../../hooks/useOutsideClick';

// Components
import CustomImage from './CustomImage';
import NetworkLink from './NetworkLink';

import { useRouter } from 'next/router';
import axiosClient from '../../config/axios';

// Styled
type PropsInput = {
    darkMode: boolean;
};

const SearchEngineInput = styled.input<PropsInput>`
    color: ${props => (props.darkMode ? 'var(--white)' : 'var(--bgDarkMode)')};

    ::placeholder {
        /* Chrome, Firefox, Opera, Safari 10.1+ */
        color: ${props => (props.darkMode ? 'var(--white)' : 'var(--bgDarkMode)')};
        opacity: 1; /* Firefox */
    }

    :-ms-input-placeholder {
        /* Internet Explorer 10-11 */
        color: ${props => (props.darkMode ? 'var(--white)' : 'var(--bgDarkMode)')};
    }

    ::-ms-input-placeholder {
        /* Microsoft Edge */
        color: ${props => (props.darkMode ? 'var(--white)' : 'var(--bgDarkMode)')};
    }
`;

// Types
type SearchEngineItem = {
    label: string;
    link: string;
};

const SearchEngine = () => {
    const router = useRouter();
    const { network } = router.query;

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
    const [entities, setEntities] = useState<string[]>([]);

    const getEntities = async () => {
        try {
            const response = await axiosClient.get(`/api/entities`, {
                params: {
                    network,
                },
            });
            const poolNames = response.data.entities.rows.map((pool: any) => pool.f_pool_name);
            setEntities(poolNames);
        } catch (error) {
            console.log(error);
        }
    };

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

        if (searchContent.length >= 3) {
            // It can be a graffiti
            items.push({
                label: `Graffiti: ${searchContent}`,
                link: `/slot/graffiti/${searchContent}`,
            });
        }

        // It can be an entity
        const expression = new RegExp(searchContent, 'i');

        getEntities();

        items.push(
            ...entities
                .sort((a, b) => (a > b ? 1 : -1))
                .filter(pool => pool.search(expression) !== -1)
                .map(pool => ({
                    label: `Entity: ${pool}`,
                    link: `/entity/${pool.toLowerCase()}`,
                }))
        );

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
            className='absolute z-40 flex top-20 xl:top-4 left-4 xl:left-[calc(50%-200px)] items-center w-[calc(100%-2rem)] xl:w-[400px] h-10 border-2 rounded-md py-1'
            style={{
                borderColor: themeMode?.darkMode ? 'var(--white)' : 'var(--bgDarkMode)',
            }}
            ref={popUpRef}
        >
            <CustomImage
                src={`/static/images/icons/magnifying_glass_icon_${themeMode?.darkMode ? 'dark' : 'light'}.webp`}
                alt='Magnifying Glass Pixel'
                width={25}
                height={25}
                className='ml-2'
            />

            <SearchEngineInput
                type='text'
                className='w-full h-full bg-transparent text-[16px] m-2 outline-none'
                placeholder='Search'
                value={search}
                onChange={handleSearch}
                darkMode={themeMode?.darkMode ?? false}
                onKeyDown={handleKeyDown}
            />

            {searchResults.length > 0 && showResults && (
                <div
                    className='absolute top-full left-0 border-2 rounded-md p-1 z-[var(--zIndexSearchEngine)] w-full border-[var(--purple)]'
                    style={{
                        color: themeMode?.darkMode ? 'var(--white)' : 'var(--black)',
                        background: themeMode?.darkMode ? 'var(--bgDarkMode)' : 'var(--white)',
                    }}
                >
                    <div
                        className={`flex flex-col gap-y-2 w-full px-4 py-4 text-xs md:text-[14px] max-h-[400px] overflow-y-scroll scrollbar-thin
                        } scrollbar-thumb-rounded`}
                    >
                        {searchResults.map((item, index) => (
                            <Fragment key={index}>
                                <NetworkLink
                                    className={`transition-all pl-1 md:hover:bg-[var(--purple)] py-2 rounded-md md:hover:text-${
                                        themeMode?.darkMode ? 'black' : 'white'
                                    }`}
                                    href={item.link}
                                    passHref
                                >
                                    <span>{item.label}</span>
                                </NetworkLink>

                                {index !== searchResults.length - 1 && (
                                    <div className='border-b border-[var(--purple)] '></div>
                                )}
                            </Fragment>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchEngine;

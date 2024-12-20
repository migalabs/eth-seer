import React, { useState, Fragment, useEffect, useRef } from 'react';
import styled from '@emotion/styled';

// Context
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

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
    // Router
    const router = useRouter();
    const { network } = router.query;

    // Theme Mode Context
    const { themeMode } = React.useContext(ThemeModeContext) ?? {};

    // Refs
    const popUpRef = useRef<HTMLDivElement>(null);

    // Hook Outside Click
    useOutsideClick(popUpRef, () => setShowResults(false));

    // States
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState<SearchEngineItem[]>([]);
    const [showResults, setShowResults] = useState(true);
    const [entities, setEntities] = useState<string[]>([]);

    useEffect(() => {
        if (network && entities.length === 0) {
            getEntities();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [network]);

    const getEntities = async () => {
        try {
            const response = await axiosClient.get('/api/entitiesList', {
                params: {
                    network,
                },
            });

            setEntities(response.data.entityListResult.map((pool: any) => pool.f_pool_name));
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

            if (searchContentNumber >= 0 && searchContentNumber <= 2147483647) {
                // It can be an epoch
                items.push({
                    label: `Epoch: ${searchContent}`,
                    link: `/epoch/${searchContent}`,
                });

                // It can be a slot
                items.push({
                    label: `Slot: ${searchContent}`,
                    link: `/slot/${searchContent}`,
                });

                // It can be a block
                items.push({
                    label: `Block: ${searchContent}`,
                    link: `/block/${searchContent}`,
                });

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

        if (searchContent.startsWith('0x')) {
            // It can be a transaction
            items.push({
                label: `Transaction: ${searchContent}`,
                link: `/transaction/${searchContent}`,
            });
        }

        // It can be an entity
        const expression = new RegExp(searchContent, 'i');

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
            className='absolute z-40 flex top-20 xl:top-4 left-4 xl:left-[calc(50%-200px)] items-center w-[calc(100%-2rem)] xl:w-[400px] h-10 border-2 rounded-md py-1 border-[var(--bgDarkMode)] dark:border-[var(--white)]'
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
                <div className='absolute top-full left-0 border-2 rounded-md p-1 z-[var(--zIndexSearchEngine)] w-full border-[var(--purple)] text-[var(--black)] dark:text-[var(--white)] bg-[var(--white)] dark:bg-[var(--bgDarkMode)]'>
                    <div
                        className={`flex flex-col gap-y-2 w-full px-4 py-4 text-xs md:text-[14px] max-h-[400px] overflow-y-scroll scrollbar-thin
                        } scrollbar-thumb-rounded`}
                    >
                        {searchResults.map((item, index) => (
                            <Fragment key={index}>
                                <NetworkLink
                                    className='transition-all pl-1 md:hover:bg-[var(--purple)] py-2 rounded-md md:hover:text-[var(--white)] dark:md:hover:text-[var(--black)]'
                                    href={item.link}
                                    passHref
                                    onClick={() => setShowResults(false)}
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

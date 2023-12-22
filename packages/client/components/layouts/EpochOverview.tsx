import React from 'react';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Components
import TooltipContainer from '../ui/TooltipContainer';
import CustomImage from '../ui/CustomImage';
import TooltipResponsive from '../ui/TooltipResponsive';
import BlockImage from '../ui/BlockImage';
import LinkSlot from '../ui/LinkSlot';

// Types
import { Block } from '../../types';

type Props = {
    epoch: number;
    blocks: Block[];
    lastEpoch: boolean;
    showClient: boolean;
};

const EpochOverview = ({ epoch, blocks, lastEpoch, showClient }: Props) => {
    // Theme Mode Context
    const { themeMode } = React.useContext(ThemeModeContext) ?? {};

    const getEntityName = (f_pool_name: string) => {
        if (f_pool_name) {
            if (f_pool_name.length > 18) {
                return `${f_pool_name.substring(0, 15)}...`;
            } else {
                return f_pool_name;
            }
        } else {
            return 'others';
        }
    };

    const getClientName = (f_client_name: string) => {
        if (f_client_name) {
            if (f_client_name.length > 18) {
                return `${f_client_name.substring(0, 15)}...`;
            } else {
                return f_client_name;
            }
        } else {
            return 'others';
        }
    };

    const getEntityText = (f_pool_name: string) => {
        return `Entity: ${getEntityName(f_pool_name)}`;
    };

    const getClientText = (f_client_name: string) => {
        return `Client: ${getClientName(f_client_name)}`;
    };

    return (
        <div className='flex flex-col'>
            <span
                className='capitalize text-center text-[16px] md:text-[18px]'
                style={{
                    color: themeMode?.darkMode ? 'var(--white)' : 'var(--newOrange)',
                }}
            >
                Epoch {epoch?.toLocaleString()}
            </span>

            <div
                className={`flex items-center my-2 p-2 h-full border-2 ${lastEpoch && 'rounded-md'}`}
                style={{
                    borderColor: lastEpoch ? 'var(--white)' : 'transparent',
                }}
            >
                <div
                    className='grid grid-cols-4 md:grid-cols-8 w-fit md:max-h-full border-2 border-[var(--white)] mx-auto gap-2 rounded-md p-6'
                    style={{
                        backgroundColor: themeMode?.darkMode ? 'var(--bgFairDarkMode)' : 'var(--bgMainLightMode)',
                        boxShadow: themeMode?.darkMode ? 'var(--boxShadowCardDark)' : 'var(--boxShadowCardLight)',
                    }}
                >
                    {blocks.map(block => (
                        <div key={block.f_slot} className='group'>
                            <LinkSlot slot={block.f_slot}>
                                <TooltipContainer>
                                    <BlockImage
                                        poolName={block.f_pool_name ?? 'others'}
                                        clientName={block.f_cl_client?.toLowerCase() ?? 'others'}
                                        proposed={block.f_proposed}
                                        height={55}
                                        width={55}
                                        showClient={showClient}
                                    />

                                    <TooltipResponsive
                                        width={225}
                                        content={
                                            <div className='flex flex-col gap-y-1 items-center'>
                                                <span>
                                                    {showClient
                                                        ? getClientText(block.f_cl_client as string)
                                                        : getEntityText(block.f_pool_name as string)}
                                                </span>
                                                <span>
                                                    Proposer: {Number(block.f_proposer_index)?.toLocaleString()}
                                                </span>
                                                <span>Slot: {Number(block.f_slot)?.toLocaleString()}</span>
                                            </div>
                                        }
                                        top='120%'
                                    />
                                </TooltipContainer>
                            </LinkSlot>
                        </div>
                    ))}

                    {blocks.length < 32 && (
                        <>
                            <CustomImage
                                src='/static/gifs/block_mining5.gif'
                                alt='Mining block'
                                width={55}
                                height={55}
                            />

                            {Array.from(Array(32 - blocks.length - 1)).map((_, idx) => (
                                <CustomImage
                                    key={idx}
                                    src='/static/gifs/block_awaiting.gif'
                                    alt='Awaiting block'
                                    width={55}
                                    height={55}
                                />
                            ))}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EpochOverview;

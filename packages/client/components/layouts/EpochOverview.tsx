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
};

const EpochOverview = ({ epoch, blocks, lastEpoch }: Props) => {
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

    return (
        <div className='flex flex-col'>
            <h3 className='uppercase text-white text-center text-sm mb-2'>Epoch {epoch?.toLocaleString()}</h3>
            <div
                className={`flex items-center p-2 h-full border-[6px] ${lastEpoch && 'rounded-3xl'}`}
                style={{
                    borderColor: lastEpoch
                        ? `${themeMode?.darkMode ? 'var(--yellow4)' : 'var(--blue2)'}`
                        : 'transparent',
                }}
            >
                <div
                    className='grid grid-cols-4 md:grid-cols-8 w-fit  md:max-h-full  mx-auto gap-2 rounded-2xl bg-[var(--yellow2)] p-4'
                    style={{
                        backgroundColor: themeMode?.darkMode ? 'var(--yellow2)' : 'var(--blue1)',
                        boxShadow: themeMode?.darkMode ? 'var(--boxShadowYellow1)' : 'var(--boxShadowBlue1)',
                    }}
                >
                    {blocks.map(block => (
                        <div key={block.f_slot} className='group'>
                            <LinkSlot slot={block.f_slot}>
                                <TooltipContainer>
                                    <BlockImage
                                        poolName={block.f_pool_name ?? 'others'}
                                        proposed={block.f_proposed}
                                        height={50}
                                        width={50}
                                    />

                                    <TooltipResponsive
                                        width={225}
                                        colorLetter='black'
                                        backgroundColor='white'
                                        content={
                                            <div className='flex flex-col gap-y-1 items-center'>
                                                <span>Entity: {getEntityName(block.f_pool_name as string)}</span>
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
                                width={50}
                                height={50}
                            />

                            {Array.from(Array(32 - blocks.length - 1)).map((_, idx) => (
                                <CustomImage
                                    key={idx}
                                    src='/static/gifs/block_awaiting.gif'
                                    alt='Awaiting block'
                                    width={50}
                                    height={50}
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

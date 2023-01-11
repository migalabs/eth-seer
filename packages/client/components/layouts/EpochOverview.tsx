import React from 'react';
import Image from 'next/image';

// Components
import { TooltipContainer, TooltipContentContainerBlocks } from '../ui/Tooltips';

// Constants
const POOLS = [
    'ANKR',
    'AVADO',
    'BINANCE',
    'BITCOINSUISSE',
    'BITFINEX',
    'BLOXSTAKING',
    'COINBASE',
    'CREAM',
    'DAPPNODE',
    'ERIGON-GFM',
    'HUOBI',
    'KRAKEN',
    'KUCOIN',
    'LIGHTHOUSE-TEAM',
    'LODESTAR-TEAM',
    'NIMBUS-TEAM',
    'OKEX',
    'PIEDAO',
    'POLONIEX',
    'PRYSM-TEAM',
    'ROCKET_POOL',
    'STAKEFISH',
    'STAKEWISE',
    'TEKU-TEAM',
    'VITALIK',
    'WEXEXCHANGE',
];

// Types
type Block = {
    f_slot: number;
    f_pool_name: string;
    f_proposed: boolean;
    f_epoch: number;
    f_proposer_index: number;
    f_graffiti: string;
};

type Props = {
    epoch: number;
    blocks: Block[];
    lastEpoch: boolean;
};

const EpochOverview = ({ epoch, blocks, lastEpoch }: Props) => {
    const getBlockImage = (block: Block) => {
        const missedExtension = block.f_proposed ? '' : '_missed';
        if (block.f_pool_name && POOLS.includes(block.f_pool_name.toUpperCase())) {
            return (
                <Image
                    src={`/static/images/blocks/block_${block.f_pool_name.toLowerCase()}${missedExtension}.svg`}
                    alt='Logo'
                    width={50}
                    height={50}
                />
            );
        } else if (block.f_pool_name && block.f_pool_name.includes('lido')) {
            return (
                <Image
                    src={`/static/images/blocks/block_lido${missedExtension}.svg`}
                    alt='Logo'
                    width={50}
                    height={50}
                />
            );
        } else if (block.f_pool_name && block.f_pool_name.includes('whale')) {
            return (
                <Image
                    src={`/static/images/blocks/block_whale${missedExtension}.svg`}
                    alt='Logo'
                    width={50}
                    height={50}
                />
            );
        } else {
            return (
                <Image
                    src={`/static/images/blocks/block_others${missedExtension}.svg`}
                    alt='Logo'
                    width={50}
                    height={50}
                />
            );
        }
    };

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
            <h3 className='uppercase text-white text-center text-sm mb-2'>Epoch {epoch.toLocaleString()}</h3>
            <div
                className={`flex items-center p-2 h-full border-[6px] ${
                    lastEpoch ? 'border-[#F0C83A] rounded-3xl' : 'border-transparent'
                }`}
            >
                <div
                    className='grid grid-cols-4 md:grid-cols-8 w-fit  md:max-h-full  mx-auto gap-2 rounded-2xl bg-[#FFF0A1] p-4'
                    style={{ boxShadow: 'inset -7px -7px 8px #F0C83A, inset 7px 7px 8px #F0C83A' }}
                >
                    {blocks.map(block => (
                        <div key={block.f_slot} className='group'>
                            <TooltipContainer>
                                {getBlockImage(block)}
                                <TooltipContentContainerBlocks>
                                    <span>Entity: {getEntityName(block.f_pool_name)}</span>
                                    <span>Proposer: {Number(block.f_proposer_index).toLocaleString()}</span>
                                    <span>Slot: {Number(block.f_slot).toLocaleString()}</span>
                                </TooltipContentContainerBlocks>
                            </TooltipContainer>
                        </div>
                    ))}

                    {blocks.length < 32 && (
                        <>
                            <Image
                                src={`/static/images/blocks/block_mining.svg`}
                                alt='Mining block'
                                width={50}
                                height={50}
                            />

                            {Array.from(Array(32 - blocks.length - 1)).map((_, idx) => (
                                <Image
                                    key={idx}
                                    src={`/static/images/blocks/block_awaiting.svg`}
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

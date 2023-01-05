import React from 'react';
import Image from 'next/image';
import { TooltipContainer, TooltipContentContainerStats } from '../ui/Tooltips';

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
    console.log(blocks);
    const getBlockImage = (block: Block) => {
        if (!block.f_proposed) {
            return <Image src={`/static/images/block_missed.svg`} alt='Logo' width={50} height={50} />;
        } else if (block.f_pool_name && POOLS.includes(block.f_pool_name.toUpperCase())) {
            return (
                <Image
                    src={`/static/images/block_${block.f_pool_name.toLowerCase()}.svg`}
                    alt='Logo'
                    width={50}
                    height={50}
                />
            );
        } else if (block.f_pool_name && block.f_pool_name.includes('lido')) {
            return <Image src={`/static/images/block_lido.svg`} alt='Logo' width={50} height={50} />;
        } else if (block.f_pool_name && block.f_pool_name.includes('whale')) {
            return <Image src={`/static/images/block_whale.svg`} alt='Logo' width={50} height={50} />;
        } else {
            return <Image src={`/static/images/block_others.svg`} alt='Logo' width={50} height={50} />;
        }
    };

    return (
        <div className='flex flex-col'>
            <p className='uppercase text-white text-center text-sm mb-2'>Epoch {epoch}</p>
            <div className={`flex items-center p-2 h-full ${lastEpoch && 'border-[6px] border-[#F0C83A] rounded-3xl'}`}>
                <div
                    className='grid grid-cols-4 md:grid-cols-8 w-fit  md:max-h-full  mx-auto gap-2 rounded-2xl bg-[#FFF0A1] p-4'
                    style={{ boxShadow: 'inset -7px -7px 8px #F0C83A, inset 7px 7px 8px #F0C83A' }}
                >
                    {blocks.map(block => (
                        <div key={block.f_slot} className='group'>
                            <p className='absolute top-4 right-4 hidden group-hover:flex text-white text-sm'>
                                {block.f_pool_name}
                            </p>
                            <TooltipContainer>
                                {getBlockImage(block)}
                                <TooltipContentContainerStats tooltipColor={'white'} colorLetter={'#000000'} blocks>
                                    {[
                                        `Entity: ${block.f_pool_name ?? 'others'}`,
                                        `Proposer: ${block.f_proposer_index}`,
                                        `Slot: ${block.f_slot}`,
                                    ].map((tooltip, idx) => (
                                        <span key={idx}>{tooltip}</span>
                                    ))}
                                </TooltipContentContainerStats>
                            </TooltipContainer>
                        </div>
                    ))}

                    {blocks.length < 32 && (
                        <>
                            <Image src={`/static/images/block_mining.svg`} alt='Mining block' width={50} height={50} />

                            {Array.from(Array(32 - blocks.length - 1)).map((_, idx) => (
                                <Image
                                    key={idx}
                                    src={`/static/images/block_awaiting.svg`}
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

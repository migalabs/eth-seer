import React from 'react';
import Image from 'next/image';

// Constants
const POOLS = [
    'AVADO',
    'BINANCE',
    'COINBASE',
    'HUOBI',
    'KUCOIN',
    'LIDO',
    'PIEDAO',
    'KRAKEN',
    'ANKR',
    'BITCOINSUISSE',
    'BITFINEX',
    'BLOXSTAKING',
    'CREAM',
    'DAPPNODE',
    'ERIGON',
    'OKEX',
    'POLONIEX',
    'ROCKETPOOL',
    'STAKEFISH',
    'STAKEWISE',
    'VITALIK',
    'WEXEXCHANGE',
];

// Types
type Block = {
    f_slot: number;
    f_pool_name: string;
    f_proposed: boolean;
    f_epoch: number;
};

type Props = {
    epoch: number;
    blocks: Block[];
};

const EpochOverview = ({ epoch, blocks }: Props) => {
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
        <div>
            <p className='uppercase text-white text-center'>Epoch {epoch}</p>
            <div className='grid grid-cols-4 md:grid-cols-8 w-fit max-h-64 md:max-h-full overflow-scroll md:overflow-hidden mx-auto gap-2 rounded-xl bg-[#FFF0A1] p-4'>
                {blocks.map(block => (
                    <div key={block.f_slot} className='group'>
                        <p className='absolute top-4 right-4 hidden group-hover:flex text-white'>{block.f_pool_name}</p>
                        {getBlockImage(block)}
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
    );
};

export default EpochOverview;

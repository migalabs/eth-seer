import React from 'react';
import Image from 'next/image';

// Constants
const POOLS = ['AVADO', 'BINANCE', 'COINBASE', 'HUOBI', 'KUCOIN', 'LIDO', 'PIEDAO'];

// Types
type Block = {
    f_val_idx: number;
    f_proposer_slot: number;
    f_pool_name: string;
    f_proposed: number;
    epoch: number;
};

type Props = {
    epoch: number;
    blocks: Block[];
};

const EpochOverview = ({ epoch, blocks }: Props) => {
    return (
        <div>
            <p className='uppercase text-white text-center'>Epoch {epoch}</p>
            <div className='grid grid-cols-4 md:grid-cols-8 w-fit max-h-64 md:max-h-full overflow-scroll md:overflow-hidden mx-auto gap-2 rounded-xl bg-[#FFF0A1] p-4'>
                {blocks.map(block => (
                    <div key={block.f_proposer_slot}>
                        {POOLS.includes(block.f_pool_name.toUpperCase()) ? (
                            <Image
                                src={`/static/images/block_${block.f_pool_name.toLowerCase()}.svg`}
                                alt='Logo'
                                width={50}
                                height={50}
                            />
                        ) : (
                            <Image src={`/static/images/block_others.svg`} alt='Logo' width={50} height={50} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EpochOverview;

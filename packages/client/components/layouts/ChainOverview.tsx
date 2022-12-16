import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import EpochOverview from './EpochOverview';

// Axios
import axiosClient from '../../config/axios';

type Block = {
    f_val_idx: number;
    f_proposer_slot: number;
    f_pool_name: string;
    f_proposed: number;
    epoch: number;
};

type Props = {};

const ChainOverview = (props: Props) => {
    // States
    const [epochs, setEpochs] = useState<Record<number, Block[]> | null>(null);

    useEffect(() => {
        if (!epochs) {
            getBlocks();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Get blocks
    const getBlocks = async () => {
        try {
            const response = await axiosClient.get(`/api/validator-rewards-summary/blocks`);

            const blocks: Block[] = response.data.blocks;

            let aux: Record<number, Block[]> = {};

            blocks.forEach(block => {
                if (aux[block.epoch]) {
                    aux[block.epoch].push(block);
                } else {
                    aux[block.epoch] = [block];
                }
            });

            setEpochs(aux);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='flex flex-row justify-center space-x-4 md:space-x-10'>
            {/* <Image src='/static/images/arrow.svg' alt='Left arrow' width={30} height={30} /> */}

            {epochs &&
                Object.entries(epochs)
                    .slice(0, 2)
                    .map(([epoch, blocks]) => <EpochOverview key={epoch} epoch={Number(epoch)} blocks={blocks} />)}
        </div>
    );
};

export default ChainOverview;

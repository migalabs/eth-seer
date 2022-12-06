import Image from 'next/image';
import React from 'react';

type Props = {
    epoch: number;
};

const EpochOverview = ({ epoch }: Props) => {
    const Epochs = () => {
        return (
            <div>
                <Image src='/static/images/block_avado.svg' alt='Logo' width={50} height={50} />
            </div>
        );
    };
    return (
        <div>
            <p className='uppercase text-white text-center'>epoch {epoch}</p>
            <div className='grid grid-cols-8 w-fit mx-auto gap-2 rounded-xl bg-[#FFF0A1] p-4 '>
                {Array(32).fill(<Epochs />)}
            </div>
        </div>
    );
};

export default EpochOverview;

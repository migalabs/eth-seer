import Image from 'next/image';
import React from 'react';

type Props = {
    epoch: number;
};

const EpochOverview = ({ epoch }: Props) => {
    return (
        <div>
            <p className='uppercase text-white text-center'>Epoch {epoch}</p>
            <div className='grid grid-cols-4 md:grid-cols-8 w-fit max-h-64 md:max-h-full overflow-scroll md:overflow-hidden mx-auto gap-2 rounded-xl bg-[#FFF0A1] p-4'>
                {Array(...Array(32)).map((_, idx) => (
                    <div key={idx}>
                        <Image src='/static/images/block_avado.svg' alt='Logo' width={50} height={50} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EpochOverview;

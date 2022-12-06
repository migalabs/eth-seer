import Image from 'next/image';
import React from 'react';
import EpochOverview from './EpochOverview';

type Props = {};

const ChainOverview = (props: Props) => {
    return (
        <div className='flex flex-row justify-center space-x-10'>
            <Image src='/static/images/arrow.svg' alt='Logo' width={30} height={30} />
            <EpochOverview epoch={10000} />
            <EpochOverview epoch={10001} />
        </div>
    );
};

export default ChainOverview;

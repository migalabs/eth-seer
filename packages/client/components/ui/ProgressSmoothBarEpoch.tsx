import React from 'react';

type Props = {
    percent: number;
    color: string;
    backgroundColor: string;
};

const ProgressSmoothBarEpoch = ({ percent, color, backgroundColor }: Props) => {
    const width = Number(percent * 100).toFixed(0);

    return (
        <div className='rounded-xl p-1 h-6' style={{ backgroundColor: color }}>
            <div className='relative rounded-lg h-4' style={{ backgroundColor, width: `${width}%` }}>
                <p className='absolute -top-1 left-[calc(50%-26px)] font-bold' style={{ color, cursor: 'default' }}>
                    {Number(Number(percent * 100).toFixed(2)).toLocaleString()}%
                </p>
            </div>
        </div>
    );
};

export default ProgressSmoothBarEpoch;

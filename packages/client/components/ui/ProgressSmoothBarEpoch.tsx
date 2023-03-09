import React from 'react';

type Props = {
    percent: number;
    color: string;
    bg: string;
};

const ProgressSmoothBarEpoch = ({ percent, color, bg }: Props) => {
    const width = Number(percent * 100).toFixed(0);

    return (
        <div>
            <div className='rounded-xl p-1 w-100 h-6' style={{ backgroundColor: bg }}>
                <div className='relative rounded-lg h-4' style={{ backgroundColor: color, width: `${width}%` }}>
                    <p
                        className='absolute -top-1 left-[calc(50%-26px)] font-bold'
                        style={{ color: bg, cursor: 'default' }}
                    >
                        {Number(Number(percent * 100).toFixed(2)).toLocaleString()}%
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProgressSmoothBarEpoch;

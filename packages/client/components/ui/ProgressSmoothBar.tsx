import React from 'react';

type Props = {
    title: string;
    percent: number;
    color: string;
    bg: string;
};

const ProgressSmoothBar = ({ title, percent, color, bg }: Props) => {
    const width = Number(percent * 100).toFixed(0);

    return (
        <div>
            <p className='uppercase'>{title}</p>
            <div className={`rounded-lg p-1 w-100 h-4`} style={{ backgroundColor: bg }}>
                <div className={`rounded-lg h-2`} style={{ backgroundColor: color, width: `${width}%` }}>
                    &nbsp;
                </div>
            </div>
            <p>{Number(percent * 100).toFixed(2)}%</p>
        </div>
    );
};

export default ProgressSmoothBar;

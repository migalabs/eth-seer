import React from 'react';
import { TooltipContainer, TooltipContentContainerStats } from './Tooltips';

type Props = {
    title: string;
    percent: number;
    color: string;
    bg: string;
    tooltipLines: string[];
    tooltipColor: string;
};

const ProgressSmoothBar = ({ title, percent, color, bg, tooltipLines, tooltipColor }: Props) => {
    const width = Number(percent * 100).toFixed(0);

    return (
        <div>
            <p className='uppercase'>{title}</p>

            <div className={`rounded-xl p-1 w-100 h-6`} style={{ backgroundColor: bg }}>
                <div className={`rounded-lg h-4`} style={{ backgroundColor: color, width: `${width}%` }}>
                    <TooltipContainer>
                        <p className='font-bold pt-1' style={{ color: bg }}>
                            {Number(percent * 100).toFixed(2)}%
                        </p>
                        <TooltipContentContainerStats tooltipColor={tooltipColor} colorLetter={bg}>
                            {tooltipLines.map((tooltip, idx) => (
                                <span key={idx}>{tooltip}</span>
                            ))}
                        </TooltipContentContainerStats>
                    </TooltipContainer>
                </div>
            </div>
        </div>
    );
};

export default ProgressSmoothBar;

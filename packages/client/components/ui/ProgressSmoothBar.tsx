import React from 'react';
import { TooltipContainer, TooltipContentContainerStats } from './Tooltips';

type Props = {
    title: string;
    percent: number;
    color: string;
    bg: string;
    tooltipColor?: string;
    tooltipContent?: any;
    width?: number;
};

const ProgressSmoothBar = ({ title, percent, color, bg, tooltipColor, tooltipContent, width }: Props) => {
    const widthInnerDiv = Number(percent * 100).toFixed(0);

    return (
        <div className='text-center leading-4'>
            <p className='uppercase'>{title}</p>

            <div className='rounded-xl p-1 h-6' style={{ backgroundColor: bg, width: width ?? 'auto' }}>
                <div className='rounded-lg h-4' style={{ backgroundColor: color, width: `${widthInnerDiv}%` }}>
                    {tooltipColor && tooltipContent ? (
                        <TooltipContainer>
                            <p className='font-bold pt-0.5' style={{ color: bg, cursor: 'default' }}>
                                {Number(Number(percent * 100).toFixed(2)).toLocaleString()}%
                            </p>
                            <TooltipContentContainerStats tooltipColor={tooltipColor} colorLetter={bg}>
                                {tooltipContent}
                            </TooltipContentContainerStats>
                        </TooltipContainer>
                    ) : (
                        <p className='font-bold pt-0.5' style={{ color: bg, cursor: 'default' }}>
                            {Number(Number(percent * 100).toFixed(2)).toLocaleString()}%
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProgressSmoothBar;

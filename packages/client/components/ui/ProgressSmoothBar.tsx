import React from 'react';

// Components
import TooltipContainer from './TooltipContainer';
import TooltipResponsive from './TooltipResponsive';

type Props = {
    title?: string;
    percent: number;
    color: string;
    backgroundColor: string;
    tooltipColor?: string;
    tooltipContent?: any;
    width?: number;
    widthTooltip?: number;
};

const ProgressSmoothBar = ({
    title,
    percent,
    color,
    backgroundColor,
    tooltipColor,
    tooltipContent,
    width,
    widthTooltip,
}: Props) => {
    const widthInnerDiv = percent > 0 ? Math.min(Number(percent * 100), 100).toFixed(0) : 100;

    return (
        <div className='text-center'>
            {title && <p className='py-1'>{title}</p>}

            <div className='rounded-md p-1' style={{ backgroundColor: color, width: width ?? 'auto' }}>
                <div className='rounded-sm' style={{ backgroundColor, width: `${widthInnerDiv}%` }}>
                    {tooltipColor && tooltipContent ? (
                        <TooltipContainer>
                            <p className='font-medium' style={{ color, cursor: 'default' }}>
                                {Number(Number(percent * 100).toFixed(2)).toLocaleString()}%
                            </p>

                            <TooltipResponsive
                                width={widthTooltip ?? 100}
                                backgroundColor={backgroundColor}
                                colorLetter={color}
                                content={tooltipContent}
                            />
                        </TooltipContainer>
                    ) : (
                        <p className='font-medium' style={{ color, cursor: 'default' }}>
                            {Number(Number(percent * 100).toFixed(2)).toLocaleString()}%
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProgressSmoothBar;

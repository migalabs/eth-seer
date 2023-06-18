import { useState } from 'react';
import styled from '@emotion/styled';
import TooltipResponsive from '../components/ui/TooltipResponsive';
import { TooltipContainer } from '../components/ui/Tooltips';

const Wrapper = styled.div`
    position: relative;
    display: inline-block;
`;

const Button = styled.button`
    background: #555;
    color: white;
    text-align: center;
    border-radius: 6px;
    padding: 5px;
    display: inline-block;
`;

const TooltipText = styled.span<{ show: boolean }>`
    visibility: ${props => (props.show ? 'visible' : 'hidden')};
    background-color: #555;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px;
    position: absolute;
    z-index: 1;
    bottom: 125%;
    left: 50%;
    margin-left: -60px;
    opacity: 0.8;
    width: auto;
    min-width: 120px;
`;

const Tooltip = () => {
    const title = 'Attesting/total active';
    const bg = '#0016D8';
    const color = '#BDC4FF';
    const percent = 1;
    const tooltipColor = 'bluedark';
    const tooltipContent = 'this is a tooltip';
    const width = '400px';
    const widthInnerDiv = Number(percent * 100).toFixed(0);

    return (
        <div className='text-center leading-4 text-xs w-fit mx-auto pt-16'>
            <p className='uppercase text-white'>{title}</p>

            <div className='rounded-xl p-1 h-6' style={{ backgroundColor: bg, width: width ?? 'auto' }}>
                <div className='rounded-lg h-4' style={{ backgroundColor: color, width: `${widthInnerDiv}%` }}>
                    {tooltipColor && tooltipContent ? (
                        <TooltipContainer>
                            <p className='font-bold pt-0.5' style={{ color: bg, cursor: 'default' }}>
                                {Number(Number(percent * 100).toFixed(2)).toLocaleString()}%
                            </p>
                            <TooltipResponsive width={300} />
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

export default Tooltip;

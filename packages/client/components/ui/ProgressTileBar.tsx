import React from 'react';
import { TooltipContainer, TooltipContentContainerStats } from './Tooltips';

type Props = {
    tooltipContent: any;
    totalBlocks: Array<number>;
};

const addBars = (restBlocks: Array<number>) => {
    return restBlocks.map((element, idx) => (
        <div key={idx} className={`w-[3px] h-2.5 ${element === 1 && 'bg-gray-400'}`} />
    ));
};

const ProgressTileBar = ({ tooltipContent, totalBlocks }: Props) => {
    return (
        <div className='flex flex-col gap-y-1'>
            <div className='flex gap-x-2 bg-[#FEE351] px-2 py-1.5 w-fit rounded-2xl border-2 border-[#D88D1C] mx-auto'>
                <TooltipContainer>
                    <div className='flex flex-col justify-center'>
                        <div className='flex gap-x-px'>
                            {totalBlocks.map((element, idx) => (
                                <div
                                    key={idx}
                                    className={`w-[3px] h-2.5 ${element === 1 ? 'bg-green-500' : 'bg-red-500'}`}
                                />
                            ))}
                            {totalBlocks.length < 32 && addBars(Array(32 - totalBlocks.length).fill(1))}
                        </div>
                    </div>
                    <TooltipContentContainerStats tooltipColor='yellow' colorLetter='#D88D1C'>
                        {tooltipContent}
                    </TooltipContentContainerStats>
                </TooltipContainer>
            </div>
        </div>
    );
};

export default ProgressTileBar;

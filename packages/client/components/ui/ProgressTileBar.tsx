import React from 'react';
import { TooltipContainer, TooltipContentContainerStats } from './Tooltips';

type Props = {
    tilesFilled: number;
    totalTiles: number;
    statsInside?: boolean;
    tooltipContent: any;
};

const ProgressTileBar = ({ tilesFilled, totalTiles, statsInside, tooltipContent }: Props) => {
    return (
        <div className='flex flex-col gap-y-1'>
            <div className='flex gap-x-2 bg-[#E9C920] px-2 py-1.5 w-fit rounded-2xl border-2 border-[#F7AF45] mx-auto'>
                <TooltipContainer>
                    <div className='flex flex-col justify-center'>
                        <div className='flex gap-x-px'>
                            {Array(...Array(totalTiles)).map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`w-[3px] h-2.5 ${idx < tilesFilled ? 'bg-green-500' : 'bg-red-500'}`}
                                />
                            ))}
                        </div>

                        {statsInside && (
                            <p className='text-sm'>
                                {tilesFilled} / {totalTiles}
                            </p>
                        )}
                    </div>
                    <TooltipContentContainerStats tooltipColor='yellow' colorLetter='#D17E00'>
                        {tooltipContent}
                    </TooltipContentContainerStats>
                </TooltipContainer>
            </div>
        </div>
    );
};

export default ProgressTileBar;

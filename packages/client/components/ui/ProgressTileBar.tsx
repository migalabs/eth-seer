import React from 'react';

// Components
import TooltipContainer from './TooltipContainer';
import TooltipResponsive from './TooltipResponsive';

type Props = {
    tooltipContent: any;
    totalBlocks: Array<number>;
    tooltipAbove?: boolean;
};

const ProgressTileBar = ({ tooltipContent, totalBlocks, tooltipAbove }: Props) => {
    const addBars = (restBlocks: Array<number>) => {
        return restBlocks.map((element, idx) => (
            <div key={idx} className={`w-[3px] h-2.5 ${element === 1 && 'bg-[var(--lightGray)]'}`} />
        ));
    };

    const staticArray = Array.from({ length: 32 }, (_, index) => {
        return 1;
    });

    return (
        <div className='flex flex-col gap-y-1'>
            <TooltipContainer>
                <div className='flex gap-x-2 bg-white px-2 py-1.5 w-fit rounded-md mx-auto'>
                    <div className='flex flex-col justify-center'>
                        <div className='flex gap-x-px'>
                            {totalBlocks?.map((element, idx) => (
                                <div
                                    key={idx}
                                    className={`w-[3px] h-2.5 ${
                                        element === 1 ? 'bg-[var(--proposedGreen)]' : 'bg-[var(--missedRed)]'
                                    }`}
                                />
                            ))}
                            {totalBlocks === undefined &&
                                staticArray.map((element, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-[3px] h-2.5 ${
                                            element === 1 ? 'bg-[var(--proposedGreen)]' : 'bg-[var(--missedRed)]'
                                        }`}
                                    />
                                ))}

                            {totalBlocks?.length < 32 && addBars(Array(32 - totalBlocks.length).fill(1))}
                        </div>
                    </div>

                    <TooltipResponsive width={200} content={tooltipContent} top='35px' tooltipAbove={tooltipAbove} />
                </div>
            </TooltipContainer>
        </div>
    );
};

export default ProgressTileBar;

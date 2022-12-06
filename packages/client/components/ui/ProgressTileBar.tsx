import React from 'react';

type Props = {
    tilesFilled: number;
    totalTiles: number;
};

const ProgressTileBar = ({ tilesFilled, totalTiles }: Props) => {
    return (
        <div>
            <div className='flex gap-x-px bg-[#E9C920] px-2 py-1.5 w-fit rounded-2xl border-2 border-[#F7AF45] mx-auto'>
                {Array(...Array(totalTiles)).map((_, idx) => (
                    <div
                        key={idx}
                        className={`w-[3px] h-2.5 ${idx < tilesFilled ? 'bg-green-500' : 'bg-red-500'}`}
                    ></div>
                ))}
            </div>

            <p className='text-sm'>
                {tilesFilled} / {totalTiles}
            </p>
        </div>
    );
};

export default ProgressTileBar;

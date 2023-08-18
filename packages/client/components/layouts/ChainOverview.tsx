import React, { useState, useEffect } from 'react';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';
import BlocksContext from '../../contexts/blocks/BlocksContext';

// Components
import EpochOverview from './EpochOverview';

const ChainOverview = () => {
    // Theme Mode Context
    const { themeMode } = React.useContext(ThemeModeContext) ?? {};

    // Blocks Context
    const { blocks, getBlocks } = React.useContext(BlocksContext) ?? {};

    // States
    const [lastEpoch, setLastEpoch] = useState(0);
    const [count, setCount] = useState(0);
    const [arrowRightHidden, setArrowRightHidden] = useState(true);
    const [arrowLeftHidden, setArrowLeftHidden] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [numberEpochsViewed, setNumberEpochsViewed] = useState(1);

    useEffect(() => {
        if (blocks && !blocks.epochs) {
            getBlocks?.(0);
        }

        if (window !== undefined) {
            if (window.innerWidth > 768) setNumberEpochsViewed(2);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blocks]);

    useEffect(() => {
        getBlocks?.(0);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (blocks && blocks.epochs) {
            // Set the last epoch
            const lastEpochAux = Object.keys(blocks.epochs)
                .map(epoch => parseInt(epoch))
                .sort((a, b) => b - a)[0];
            setLastEpoch(lastEpochAux || 0);
        }
    }, [blocks]);

    const handleLeft = () => {
        if (blocks && blocks.epochs && Object.entries(blocks.epochs).length - numberEpochsViewed - count === 1) {
            getBlocks?.(currentPage + 1);
            setCurrentPage(prevState => prevState + 1);
        }

        if (count !== 1) {
            setArrowRightHidden(false);
        }

        setCount(count + 1);
    };

    const handleRight = () => {
        if (count === 1) {
            setArrowRightHidden(true);
        }

        if (blocks && blocks.epochs && Object.entries(blocks.epochs).length - numberEpochsViewed - count !== 1) {
            setArrowLeftHidden(false);
        }

        setCount(count - 1);
    };

    return (
        <div className='flex flex-row justify-center items-center gap-4'>
            <div className='flex mt-5'>
                {themeMode?.darkMode ? (
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='50'
                        height='50'
                        viewBox='0 0 16 16'
                        className={`stroke-[#fbc508] stroke-1 dark-mode-class ${
                            arrowLeftHidden ? 'opacity-0' : 'cursor-pointer'
                        }`}
                        onClick={() => arrowLeftHidden || handleLeft()}
                    >
                        <path
                            fill-rule='evenodd'
                            d='M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z'
                        />
                    </svg>
                ) : (
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='50'
                        height='50'
                        viewBox='0 0 16 16'
                        className={`stroke-[#6cc4e0] stroke-1 light-mode-class' ${
                            arrowLeftHidden ? 'opacity-0' : 'cursor-pointer'
                        }`}
                        onClick={() => arrowLeftHidden || handleLeft()}
                    >
                        <path
                            fill-rule='evenodd'
                            d='M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z'
                        />
                    </svg>
                )}
            </div>

            {blocks &&
                blocks.epochs &&
                Object.entries(blocks.epochs)
                    .slice(
                        Object.entries(blocks.epochs).length - numberEpochsViewed - count,
                        Object.entries(blocks.epochs).length - count
                    )
                    .map(([epoch, blocksEpoch]) => (
                        <EpochOverview
                            key={epoch}
                            epoch={Number(epoch)}
                            blocks={blocksEpoch.sort((a, b) => a.f_slot - b.f_slot)}
                            lastEpoch={epoch === lastEpoch.toString()}
                        />
                    ))}

            <div className='flex mt-5'>
                {themeMode?.darkMode ? (
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='50'
                        height='50'
                        viewBox='0 0 16 16'
                        className={`stroke-[#fbc508] stroke-1 dark-mode-class ${
                            arrowRightHidden ? 'opacity-0' : 'cursor-pointer'
                        }`}
                        onClick={() => arrowRightHidden || handleRight()}
                    >
                        <path
                            fill-rule='evenodd'
                            d='M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z'
                        />
                    </svg>
                ) : (
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='50'
                        height='50'
                        viewBox='0 0 16 16'
                        className={`stroke-[#6cc4e0] stroke-1 light-mode-class' ${
                            arrowRightHidden ? 'opacity-0' : 'cursor-pointer'
                        }`}
                        onClick={() => arrowRightHidden || handleRight()}
                    >
                        <path
                            fill-rule='evenodd'
                            d='M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z'
                        />
                    </svg>
                )}
            </div>
        </div>
    );
};

export default ChainOverview;

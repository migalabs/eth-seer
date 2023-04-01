import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import EpochOverview from './EpochOverview';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';
import BlocksContext from '../../contexts/blocks/BlocksContext';

const ChainOverview = () => {
    // Theme Mode Context
    const { themeMode } = React.useContext(ThemeModeContext) || {};

    // Blocks Context
    const { blocks, getBlocks } = React.useContext(BlocksContext) || {};

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
        <div className='flex flex-row justify-center space-x-4 md:space-x-5 px-7'>
            <div className='flex items-center mt-8'>
                <Image
                    src={themeMode?.darkMode ? '/static/images/arrow.svg' : '/static/images/arrow-blue.svg'}
                    alt='Left arrow'
                    width={30}
                    height={30}
                    onClick={() => arrowLeftHidden || handleLeft()}
                    className={`h-fit ${arrowLeftHidden ? 'opacity-0' : 'cursor-pointer'}`}
                />
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

            <div className='flex items-center mt-8'>
                <Image
                    src={themeMode?.darkMode ? '/static/images/arrow.svg' : '/static/images/arrow-blue.svg'}
                    alt='Left arrow'
                    width={30}
                    height={30}
                    onClick={() => arrowRightHidden || handleRight()}
                    className={`h-fit rotate-180 ${arrowRightHidden ? 'opacity-0' : 'cursor-pointer'}`}
                />
            </div>
        </div>
    );
};

export default ChainOverview;

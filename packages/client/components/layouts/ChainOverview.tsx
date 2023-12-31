import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';

// Contexts
import BlocksContext from '../../contexts/blocks/BlocksContext';

// Hooks
import useLargeView from '../../hooks/useLargeView';

// Components
import EpochOverview from './EpochOverview';
import Arrow from '../ui/Arrow';
import Toggle from '../ui/Toggle';

const ChainOverview = () => {
    // Router
    const router = useRouter();
    const { network } = router.query;

    // Blocks Context
    const { blocks, getBlocks } = useContext(BlocksContext) ?? {};

    // Large View Hook
    const isLargeView = useLargeView();

    // States
    const [lastEpoch, setLastEpoch] = useState(0);
    const [count, setCount] = useState(0);
    const [arrowRightHidden, setArrowRightHidden] = useState(true);
    const [arrowLeftHidden, setArrowLeftHidden] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [numberEpochsViewed, setNumberEpochsViewed] = useState(1);
    const [showClient, setShowClient] = useState(false);

    useEffect(() => {
        if (network && blocks && !blocks.epochs) {
            getBlocks?.(network as string, 0);
        }

        if (blocks && blocks.epochs) {
            // Set the last epoch
            const lastEpochAux = Object.keys(blocks.epochs)
                .map(epoch => parseInt(epoch))
                .sort((a, b) => b - a)[0];
            setLastEpoch(lastEpochAux || 0);
        }

        if (isLargeView) {
            setNumberEpochsViewed(2);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [network, blocks, isLargeView]);

    const handleLeft = () => {
        if (blocks && blocks.epochs && Object.entries(blocks.epochs).length - numberEpochsViewed - count === 5) {
            getBlocks?.(network as string, currentPage + 1);
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
        <div className='flex justify-center space-x-4 md:space-x-5'>
            <div className='flex items-center mt-8'>
                <Arrow
                    direction='left'
                    width={50}
                    height={50}
                    onClick={() => arrowLeftHidden || handleLeft()}
                    className={`h-fit ${arrowLeftHidden ? 'opacity-0' : ''}`}
                />
            </div>

            <div className='flex flex-col gap-y-4'>
                {network === 'mainnet' && (
                    <div className='flex justify-center md:justify-start pl-2'>
                        <Toggle
                            value={showClient}
                            labelLeft='CL Clients'
                            labelRight='Entities'
                            onToggle={() => setShowClient(!showClient)}
                        />
                    </div>
                )}

                <div className='flex justify-center space-x-4 md:space-x-5'>
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
                                    blocks={[...blocksEpoch].sort((a, b) => a.f_slot - b.f_slot)}
                                    lastEpoch={epoch === lastEpoch.toString()}
                                    showClient={showClient}
                                />
                            ))}
                </div>
            </div>

            <div className='flex items-center mt-8'>
                <Arrow
                    direction='right'
                    width={50}
                    height={50}
                    onClick={() => arrowRightHidden || handleRight()}
                    className={`h-fit ${arrowRightHidden ? 'opacity-0' : ''}`}
                />
            </div>
        </div>
    );
};

export default ChainOverview;

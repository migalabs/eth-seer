import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';

// Contexts
import BlocksContext from '../../contexts/blocks/BlocksContext';
import EpochsContext from '../../contexts/epochs/EpochsContext';

// Components
import ViewMoreButton from '../ui/ViewMoreButton';
import Epochs from './Epochs';

const Statistics = () => {
    // Router
    const router = useRouter();
    const { network } = router.query;

    // Blocks Context
    const { blocks, getBlocks } = useContext(BlocksContext) ?? {};

    // Epochs Context
    const { epochs, getEpochs } = useContext(EpochsContext) ?? {};

    // States
    const [currentPage, setCurrentPage] = useState(0);
    const [blocksLoaded, setBlocksLoaded] = useState(false);
    const [loadingEpochs, setLoadingEpochs] = useState(true);

    //UseEffect
    useEffect(() => {
        // Fetching blocks
        if (network && blocks && !blocks.epochs && !blocksLoaded) {
            setBlocksLoaded(true);
            getBlocks?.(network as string, 0);
        }

        // Fetching epochs
        if (network && epochs && epochs.epochs.length === 0) {
            getEpochs?.(network as string, 0);
        }

        if (epochs && epochs.epochs.length > 0 && loadingEpochs) {
            setLoadingEpochs(false);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [network, blocks, epochs]);

    const handleViewMore = async () => {
        setLoadingEpochs(true);
        await getEpochs?.(network as string, currentPage + 1);
        setCurrentPage(prevState => prevState + 1);
        // setLoadingEpochs(false); -> No need to set it to false because it will be set to false in the useEffect
    };

    return (
        <>
            {epochs && blocks && (
                <Epochs
                    epochs={epochs.epochs}
                    blocksPerEpoch={blocks.epochs}
                    showCalculatingEpochs
                    fetchingEpochs={loadingEpochs}
                    showRowsWhileFetching
                />
            )}

            <div className='mt-6'>
                <ViewMoreButton onClick={handleViewMore} />
            </div>
        </>
    );
};

export default Statistics;

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import EpochOverview from './EpochOverview';

// Axios
import axiosClient from '../../config/axios';

type Block = {
    f_slot: number;
    f_pool_name: string;
    f_proposed: boolean;
    f_epoch: number;
    f_proposer_index: number;
    f_graffiti: string;
};

const ChainOverview = () => {
    // States
    const [epochs, setEpochs] = useState<Record<number, Block[]> | null>(null);
    const [lastEpoch, setLastEpoch] = useState(0);
    const [count, setCount] = useState(0);
    const [arrowRightHidden, setArrowRightHidden] = useState(true);
    const [arrowLeftHidden, setArrowLeftHidden] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [numberEpochsViewed, setNumberEpochsViewed] = useState(1);

    useEffect(() => {
        if (!epochs) {
            getBlocks(0);
        }

        if (window !== undefined) {
            if (window.innerWidth > 768) setNumberEpochsViewed(2);
        }

        const eventSource = new EventSource(
            `${process.env.NEXT_PUBLIC_URL_API}/api/validator-rewards-summary/new-block-notification`
        );
        eventSource.addEventListener('new_block', function (e) {
            getBlocks(0, 32);
        });

        return () => {
            eventSource.close();
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Get blocks
    const getBlocks = async (page: number, limit: number = 320) => {
        try {
            const response = await axiosClient.get(`/api/validator-rewards-summary/blocks`, {
                params: {
                    limit,
                    page,
                },
            });
            const blocks: Block[] = response.data.blocks;

            if (blocks.length === 0) {
                setCount(epochs ? Object.entries(epochs).length - 2 : 0);
                setArrowLeftHidden(true);
            }

            let aux: Record<number, Block[]> = epochs || {};
            let lastEpochAux = -1;

            blocks.forEach(block => {
                if (aux[block.f_epoch]) {
                    if (!aux[block.f_epoch].some(b => b.f_slot === block.f_slot)) {
                        aux[block.f_epoch] = [block, ...aux[block.f_epoch]];
                    }
                } else {
                    aux[block.f_epoch] = [block];
                }

                if (block.f_epoch > lastEpochAux) {
                    lastEpochAux = block.f_epoch;
                }
            });

            setEpochs(prevState => {
                if (prevState) {
                    return {
                        ...prevState,
                        [lastEpochAux]: aux[lastEpochAux],
                    };
                } else {
                    return aux;
                }
            });

            setLastEpoch(prevState => {
                if (prevState < lastEpochAux) return lastEpochAux;
                else return prevState;
            });

            if (page > 0) {
                setCurrentPage(page);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleLeft = () => {
        if (epochs && Object.entries(epochs).length - numberEpochsViewed - count === 1) {
            getBlocks(currentPage + 1);
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

        if (epochs && Object.entries(epochs).length - numberEpochsViewed - count !== 1) {
            setArrowLeftHidden(false);
        }

        setCount(count - 1);
    };

    return (
        <div className='flex flex-row justify-center space-x-4 md:space-x-5 px-1'>
            <div className='flex items-center mt-8'>
                <Image
                    src='/static/images/arrow.svg'
                    alt='Left arrow'
                    width={30}
                    height={30}
                    onClick={() => arrowLeftHidden || handleLeft()}
                    className={`h-fit ${arrowLeftHidden ? 'opacity-0' : 'cursor-pointer'}`}
                />
            </div>

            {epochs &&
                Object.entries(epochs)
                    .slice(
                        Object.entries(epochs).length - numberEpochsViewed - count,
                        Object.entries(epochs).length - count
                    )
                    .map(([epoch, blocks]) => (
                        <EpochOverview
                            key={epoch}
                            epoch={Number(epoch)}
                            blocks={blocks.sort((a, b) => a.f_slot - b.f_slot)}
                            lastEpoch={epoch === lastEpoch.toString()}
                        />
                    ))}

            <div className='flex items-center mt-8'>
                <Image
                    src='/static/images/arrow.svg'
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

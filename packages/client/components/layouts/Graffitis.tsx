import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// Axios
import axiosClient from '../../config/axios';

// Hooks
import useLargeView from '../../hooks/useLargeView';

// Components
import InfoBox from './InfoBox';
import TooltipResponsive from '../ui/TooltipResponsive';
import ViewMoreButton from '../ui/ViewMoreButton';
import LinkValidator from '../ui/LinkValidator';
import LinkSlot from '../ui/LinkSlot';
import Title from '../ui/Title';
import { LargeTable, LargeTableHeader, LargeTableRow, SmallTable, SmallTableCard } from '../ui/Table';

// Types
import { Block } from '../../types';

const Graffitis = () => {
    // Router
    const router = useRouter();
    const { network, graffiti } = router.query;

    // Large View Hook
    const isLargeView = useLargeView();

    // States
    const [currentPage, setCurrentPage] = useState(0);
    const [disableViewMore, setDisableViewMore] = useState(true);
    const [showInfoBox, setShowInfoBox] = useState(false);
    const [loading, setLoading] = useState(true);
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [blockGenesis, setBlockGenesis] = useState(0);

    useEffect(() => {
        if (network && graffiti && blocks.length === 0) {
            getGraffities(0);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [network, graffiti]);

    const getGraffities = async (page: number, limit: number = 10) => {
        try {
            setLoading(true);
            setCurrentPage(page);

            const [response, genesisBlock] = await Promise.all([
                axiosClient.get(`/api/slots/graffiti/${graffiti}`, {
                    params: {
                        network,
                        limit,
                        page,
                    },
                }),
                axiosClient.get('/api/networks/block/genesis', {
                    params: {
                        network,
                    },
                }),
            ]);

            setBlocks([...blocks, ...response.data.blocks]);
            setBlockGenesis(genesisBlock.data.block_genesis);

            if (response.data.blocks.length === 0) {
                setShowInfoBox(true);
            } else if (response.data.blocks.length < limit) {
                setDisableViewMore(true);
            } else {
                setDisableViewMore(false);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const getLargeView = () => (
        <LargeTable minWidth={600} noRowsText={`"${graffiti}" not found`} fetchingRows={loading} showRowsWhileFetching>
            <LargeTableHeader
                text='Time'
                width='20%'
                tooltipContent={
                    <TooltipResponsive
                        width={220}
                        content={
                            <>
                                <span>Time at which the slot</span>
                                <span>should have passed</span>
                                <span>(calculated since genesis)</span>
                            </>
                        }
                        top='34px'
                    />
                }
            />

            <LargeTableHeader
                text='Slot'
                width='20%'
                tooltipContent={<TooltipResponsive width={160} content={<span>Slot number</span>} top='34px' />}
            />

            <LargeTableHeader
                text='Validator'
                width='20%'
                tooltipContent={<TooltipResponsive width={160} content={<span>Validator number</span>} top='34px' />}
            />

            <LargeTableHeader
                text='Graffiti'
                width='40%'
                tooltipContent={<TooltipResponsive width={160} content={<span>Graffiti text</span>} top='34px' />}
            />

            {blocks.map((block: Block) => (
                <LargeTableRow key={block.f_slot}>
                    <div className='flex flex-col w-[20%] font-medium'>
                        <p>{new Date(blockGenesis + block.f_slot * 12000).toLocaleDateString('ja-JP')}</p>
                        <p>{new Date(blockGenesis + block.f_slot * 12000).toLocaleTimeString('ja-JP')}</p>
                    </div>

                    <div className='w-[20%]'>
                        <LinkSlot slot={block.f_slot} mxAuto />
                    </div>

                    <div className='w-[20%]'>
                        <LinkValidator validator={block.f_proposer_index} mxAuto />
                    </div>

                    <div className='w-[40%] font-medium'>
                        <p>{block.f_graffiti?.toLocaleString()}</p>
                    </div>
                </LargeTableRow>
            ))}
        </LargeTable>
    );

    const getSmallView = () => (
        <SmallTable noRowsText={`"${graffiti}" not found`} fetchingRows={loading} showRowsWhileFetching>
            {blocks.map((block: Block) => (
                <SmallTableCard key={block.f_slot}>
                    <div className='flex flex-col w-full'>
                        <div className='flex items-center justify-between py-1'>
                            <p className='font-semibold'>Slot:</p>
                            <LinkSlot slot={block.f_slot} />
                        </div>

                        <div className='flex items-center justify-between gap-x-14 py-1'>
                            <p className='font-semibold'>Proposer:</p>
                            <LinkValidator validator={block.f_proposer_index} />
                        </div>

                        <div className='flex items-center justify-between py-1'>
                            <p className='font-semibold'>Time:</p>
                            <div className='flex flex-col text-end'>
                                <p>{new Date(blockGenesis + block.f_slot * 12000).toLocaleDateString('ja-JP')}</p>
                                <p>{new Date(blockGenesis + block.f_slot * 12000).toLocaleTimeString('ja-JP')}</p>
                            </div>
                        </div>

                        <div className='flex items-center justify-between py-1'>
                            <p className='font-semibold'>Graffiti:</p>
                            <p>{block.f_graffiti}</p>
                        </div>
                    </div>
                </SmallTableCard>
            ))}
        </SmallTable>
    );

    return (
        <div>
            <Title>Graffiti Search Result</Title>

            {blocks.length > 0 && (isLargeView ? getLargeView() : getSmallView())}

            {!disableViewMore && (
                <div className='mt-6'>
                    <ViewMoreButton onClick={() => getGraffities(currentPage + 1)} />
                </div>
            )}

            {showInfoBox && <InfoBox text={`"${graffiti}" not found`} />}
        </div>
    );
};

export default Graffitis;

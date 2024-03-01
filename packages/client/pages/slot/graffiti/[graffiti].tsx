import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

// Axios
import axiosClient from '../../../config/axios';

// Hooks
import useLargeView from '../../../hooks/useLargeView';

// Components
import Layout from '../../../components/layouts/Layout';
import TooltipResponsive from '../../../components/ui/TooltipResponsive';
import LinkSlot from '../../../components/ui/LinkSlot';
import LinkValidator from '../../../components/ui/LinkValidator';
import Title from '../../../components/ui/Title';
import ViewMoreButton from '../../../components/ui/ViewMoreButton';
import InfoBox from '../../../components/layouts/InfoBox';
import { LargeTable, LargeTableHeader, LargeTableRow, SmallTable, SmallTableCard } from '../../../components/ui/Table';

// Types
import { Block } from '../../../types';

// Props
interface Props {
    graffiti: string;
    network: string;
}

// Server Side Props
export const getServerSideProps: GetServerSideProps = async context => {
    const graffiti = context.params?.graffiti;
    const network = context.query?.network;

    if (!graffiti || !network) {
        return {
            notFound: true,
        };
    }

    return { props: { graffiti, network } };
};

const GraffitiSearch = ({ graffiti, network }: Props) => {
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
        if (blocks.length === 0) {
            getGraffities(0);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
        <Layout
            title={`Find Slots by Graffiti '${graffiti}' - Ethereum Beacon Chain | EthSeer.io`}
            description={`Explore slots on the Ethereum Beacon Chain with graffiti '${graffiti}'. Discover blocks marked with unique identifiers and messages. Dive into Ethereum's graffiti insights with EthSeer.io.`}
        >
            <Head>
                <meta name='robots' property='noindex' />
            </Head>

            <Title>Graffiti Search Result</Title>

            {blocks.length > 0 && (isLargeView ? getLargeView() : getSmallView())}

            {!disableViewMore && (
                <div className='mt-6'>
                    <ViewMoreButton onClick={() => getGraffities(currentPage + 1)} />
                </div>
            )}

            {showInfoBox && <InfoBox text={`"${graffiti}" not found`} />}
        </Layout>
    );
};

export default GraffitiSearch;

import Image from 'next/image';
import React from 'react';
import styled from '@emotion/styled';

// Components
import ProgressTileBar from '../ui/ProgressTileBar';
import ProgressSmoothBar from '../ui/ProgressSmoothBar';

// Styled
const Card = styled.div`
    box-shadow: inset -5px -5px 4px rgba(227, 203, 75, 0.5), inset 5px 5px 4px rgba(227, 203, 75, 0.5);
`;

type Props = {};

const Statitstics = (props: Props) => {
    const epochs = [
        {
            epoch: 100000,
            slot: 100064,
            blocks: 26,
            target: 0.49,
            source: 0.73,
            head: 0.23,
            attesting: 0.88,
            eth: 23.8,
        },
        {
            epoch: 99999,
            slot: 100032,
            blocks: 28,
            target: 0.67,
            source: 0.23,
            head: 0.46,
            attesting: 0.99,
            eth: 14.4,
        },
        {
            epoch: 99998,
            slot: 100000,
            blocks: 30,
            target: 0.12,
            source: 0.46,
            head: 0.69,
            attesting: 0.78,
            eth: 40.5,
        },
    ];

    const getDesktopView = () => (
        <div className='flex flex-col px-5'>
            <div className='flex gap-x-1 justify-around py-3 items-center uppercase text-lg'>
                <p className='w-2/12'>Epoch</p>
                <p className='w-1/12'>Slot</p>
                <div className='w-2/12'>
                    <Image
                        className='mx-auto'
                        src='/static/images/blocks_icon.svg'
                        alt='Blocks'
                        width={40}
                        height={40}
                    />
                </div>
                <p className='w-4/12'>Attestation Accuracy</p>
                <p className='w-2/12'>Balance</p>
                <div className='w-1/12'>
                    <Image className='mx-auto' src='/static/images/cup.svg' alt='Blocks' width={30} height={30} />
                </div>
            </div>

            <div className='flex flex-col gap-y-4'>
                {epochs.map(epoch => (
                    <Card
                        key={epoch.epoch}
                        className='flex gap-x-1 justify-around items-center text-lg text-black bg-[#FFF0A2] rounded-lg py-3'
                    >
                        <p className='w-2/12'>{epoch.epoch}</p>
                        <p className='w-2/12'>{epoch.slot}</p>
                        <div className='w-2/12 pt-4'>
                            <ProgressTileBar tilesFilled={epoch.blocks} totalTiles={32} />
                        </div>
                        <div className='flex gap-x-1 justify-center w-4/12'>
                            <div className='flex-1'>
                                <ProgressSmoothBar title='Target' bg='#D17E00' color='#FFC163' percent={epoch.target} />
                            </div>
                            <div className='flex-1'>
                                <ProgressSmoothBar title='Source' bg='#00C5D1' color='#94F9FF' percent={epoch.source} />
                            </div>
                            <div className='flex-1'>
                                <ProgressSmoothBar title='Head' bg='#8F76D6' color='#CAB8FF' percent={epoch.head} />
                            </div>
                        </div>
                        <div className='w-3/12'>
                            <ProgressSmoothBar
                                title='Attesting/total active'
                                bg='#0016D8'
                                color='#BDC4FF'
                                percent={epoch.attesting}
                            />
                        </div>
                        <p className='w-1/12'>{epoch.eth} ETH</p>
                    </Card>
                ))}
            </div>
        </div>
    );

    const getPhoneView = () => (
        <div className='flex flex-col gap-y-4 uppercase px-4 mt-3'>
            {epochs.map(epoch => (
                <Card
                    key={epoch.epoch}
                    className='flex flex-col gap-y-4 justify-around items-center text-lg text-black bg-[#FFF0A2] rounded-lg py-3'
                >
                    <p className='font-bold'>Epoch {epoch.epoch}</p>

                    <div className='flex gap-x-4'>
                        <div>
                            <p className='uppercase'>Slot</p>
                            <p>{epoch.epoch}</p>
                        </div>
                        <div>
                            <ProgressTileBar tilesFilled={epoch.blocks} totalTiles={32} hasImage statsInside />
                        </div>
                    </div>
                    <div className='flex flex-col gap-y-2'>
                        <p>Attestation Accuracy</p>

                        <ProgressSmoothBar title='Target' bg='#D17E00' color='#FFC163' percent={epoch.target} />

                        <ProgressSmoothBar title='Source' bg='#00C5D1' color='#94F9FF' percent={epoch.source} />

                        <ProgressSmoothBar title='Head' bg='#8F76D6' color='#CAB8FF' percent={epoch.head} />
                    </div>

                    <div className='flex flex-col gap-y-2'>
                        <p>Balance</p>

                        <ProgressSmoothBar
                            title='Attesting/total active'
                            bg='#0016D8'
                            color='#BDC4FF'
                            percent={epoch.attesting}
                        />
                    </div>

                    <div className='flex gap-x-4'>
                        <Image className='mx-auto' src='/static/images/cup.svg' alt='Blocks' width={30} height={30} />
                        <p>{epoch.eth} ETH</p>
                    </div>
                </Card>
            ))}
        </div>
    );

    return (
        <div className='text-center text-white'>
            <h1 className='text-3xl md:text-5xl uppercase'>Epoch Statistics</h1>

            {typeof window !== 'undefined' && window.innerWidth > 768 ? getDesktopView() : getPhoneView()}
        </div>
    );
};

export default Statitstics;

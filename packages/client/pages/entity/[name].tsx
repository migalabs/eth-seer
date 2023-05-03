import React, { useContext } from 'react';
import { useRouter } from 'next/router';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Components
import Layout from '../../components/layouts/Layout';
import BlockGif from '../../components/ui/BlockGif';

type Props = {
    content: string;
    bg: string;
    color: string;
    rounded?: boolean;
};
const CardContent = ({ content, bg, color, rounded }: Props) => {
    return (
        <span
            className={`block uppercase border-2 px-5 ${
                rounded ? 'rounded-2xl' : 'rounded-lg'
            } font-bold leading-5 py-0.5 sm:py-1`}
            style={{ background: bg, borderColor: color, color: color }}
        >
            {content}
        </span>
    );
};

const Entity = () => {
    // Next router
    const router = useRouter();
    const {
        query: { name },
    } = router;

    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) || {};

    return (
        <Layout isMain={false}>
            <div className='flex gap-x-3 justify-center items-center mt-2 mb-5'>
                <h1 className='text-white text-center text-xl md:text-3xl uppercase'>{name}</h1>
            </div>

            <div className='mx-auto max-w-[1100px]'>
                <div
                    className='flex mx-2 px-10 py-5 rounded-[22px] justify-between items-center gap-x-5'
                    style={{
                        backgroundColor: themeMode?.darkMode ? 'var(--yellow2)' : 'var(--blue1)',
                        boxShadow: themeMode?.darkMode ? 'var(--boxShadowYellow1)' : 'var(--boxShadowBlue1)',
                    }}
                >
                    <div className='flex flex-col gap-y-2 uppercase text-black text-xl text-[8px] sm:text-[10px]'>
                        <div className='flex flex-row items-center gap-x-5'>
                            <p className='w-60'>Aggregate Balance:</p>
                            <p className='leading-3'>10000</p>
                        </div>

                        <div className='flex flex-col sm:flex-row gap-x-5'>
                            <p className='w-60'>Blocks (out of 32):</p>
                            <div className='flex justify-center gap-x-4 '>
                                <CardContent content={`Proposed: ${30}`} bg='#83E18C' color='#00720B' rounded />
                                <CardContent content={`Missed: ${32 - 30}`} bg='#FF9090' color='#980E0E' rounded />
                            </div>
                        </div>

                        <div className='flex flex-col gap-y-5'>
                            <p className='w-60'>Number of Validators:</p>
                            <div className='flex justify-center gap-x-4 '>
                                <CardContent content={`Deposited: ${20}`} bg='#98D3E6' color='#0080A9' />
                                <CardContent content={`Active: ${20}`} bg='#9BD8A1' color='#00720B' />
                                <CardContent content={`Slashed: ${20}`} bg='#EFB0B0' color='#980E0E' />
                                <CardContent content={`Exited: ${20}`} bg='#CDA4DC' color='#5D3BBD' />
                            </div>
                        </div>
                    </div>

                    <div className='hidden md:block'>
                        <BlockGif poolName={name?.toString() || ''} width={150} height={150} />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Entity;

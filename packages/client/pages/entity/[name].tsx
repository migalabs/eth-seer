import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// Contexts
import ThemeModeContext from '../../contexts/theme-mode/ThemeModeContext';

// Components
import Layout from '../../components/layouts/Layout';
import BlockGif from '../../components/ui/BlockGif';
import axiosClient from '../../config/axios';
import { Entity } from '../../types';
import Animation from '../../components/layouts/Animation';

type Props = {
    content: string;
    bg: string;
    color: string;
    rounded?: boolean;
    isFixedWidth?: boolean;
};

const CardContent = ({ content, bg, color, rounded, isFixedWidth }: Props) => {
    return (
        <span
            className={`block uppercase border-2 px-5 ${
                rounded ? 'rounded-2xl' : 'rounded-lg'
            } font-bold leading-5 py-0.5 sm:py-1 ${isFixedWidth ? 'w-40 sm:w-48' : ''}`}
            style={{ background: bg, borderColor: color, color: color }}
        >
            {content}
        </span>
    );
};

const EntityComponent = () => {
    // Next router
    const router = useRouter();
    const {
        query: { name },
    } = router;

    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    // States
    const [entity, setEntity] = useState<Entity | null>(null);
    const [showAnimation, setShowAnimation] = useState<boolean>(false);

    // UseEffect
    useEffect(() => {
        if (name && !entity) {
            getEntity();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name]);

    const getEntity = async () => {
        try {
            const response = await axiosClient.get(
                `/api/validator-rewards-summary/entity/${(name as string).toLowerCase()}`
            );

            if (response.data.entity) {
                setEntity(response.data.entity);
            } else {
                setShowAnimation(true);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Layout isMain={false}>
            <div className='flex gap-x-3 justify-center items-center mt-2 mb-5'>
                <h1 className='text-white text-center text-xl md:text-3xl uppercase'>{name}</h1>
            </div>
            {entity ? (
                <div className='mx-auto max-w-[1100px]'>
                    <div
                        className='flex mx-2 px-4 sm:px-10 py-5 rounded-[22px] justify-between items-center gap-x-5'
                        style={{
                            backgroundColor: themeMode?.darkMode ? 'var(--yellow2)' : 'var(--blue1)',
                            boxShadow: themeMode?.darkMode ? 'var(--boxShadowYellow1)' : 'var(--boxShadowBlue1)',
                        }}
                    >
                        <div className='flex flex-col gap-y-2 uppercase text-black text-xl text-[8px] sm:text-[10px] mx-auto md:mx-0'>
                            <div className='flex flex-row items-center gap-x-5'>
                                <p className='leading-3 w-24 xs:w-44 sm:w-60'>Aggregate Balance:</p>
                                <p className='leading-3'>{entity && entity.aggregate_balance?.toLocaleString()} ETH</p>
                            </div>

                            <div className='flex flex-col sm:flex-row gap-x-5 gap-y-1'>
                                <p className='w-44 sm:w-60'>Blocks:</p>
                                <div className='flex flex-col sm:flex-row sm:justify-center gap-x-4 gap-y-2'>
                                    <CardContent
                                        content={`Proposed: ${
                                            entity && entity.proposed_blocks.f_proposed?.toLocaleString()
                                        }`}
                                        bg='#83E18C'
                                        color='#00720B'
                                        rounded
                                    />
                                    <CardContent
                                        content={`Missed: ${
                                            entity && entity.proposed_blocks.f_missed?.toLocaleString()
                                        }`}
                                        bg='#FF9090'
                                        color='#980E0E'
                                        rounded
                                    />
                                </div>
                            </div>

                            <div className='flex flex-col gap-y-1 xs:gap-y-5'>
                                <p className='w-44 sm:w-60'>Number of Validators:</p>
                                <div className='flex flex-col xl:flex-row items-center md:justify-center gap-x-4 gap-y-2'>
                                    <CardContent
                                        content={`Deposited: ${entity && entity.deposited?.toLocaleString()}`}
                                        bg='#98D3E6'
                                        color='#0080A9'
                                        isFixedWidth
                                    />
                                    <CardContent
                                        content={`Active: ${entity && entity.active?.toLocaleString()}`}
                                        bg='#9BD8A1'
                                        color='#00720B'
                                        isFixedWidth
                                    />
                                    <CardContent
                                        content={`Slashed: ${entity && entity.slashed?.toLocaleString()}`}
                                        bg='#EFB0B0'
                                        color='#980E0E'
                                        isFixedWidth
                                    />
                                    <CardContent
                                        content={`Exited: ${entity && entity.exited?.toLocaleString()}`}
                                        bg='#CDA4DC'
                                        color='#5D3BBD'
                                        isFixedWidth
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='hidden md:block'>
                            <BlockGif poolName={name?.toString() ?? 'others'} width={150} height={150} />
                        </div>
                    </div>
                </div>
            ) : (
                showAnimation && <Animation text={`We're not there yet`} />
            )}
        </Layout>
    );
};

export default EntityComponent;

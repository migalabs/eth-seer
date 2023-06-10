import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

// Axios
import axiosClient from '../../../config/axios';

// Contexts
import ThemeModeContext from '../../../contexts/theme-mode/ThemeModeContext';

// Components
import Layout from '../../../components/layouts/Layout';

// Types
import { Block } from '../../../types';

const SlotGraffitiSearch = () => {
    // Router
    const router = useRouter();
    const { graffiti } = router.query;

    // Theme Mode Context
    const { themeMode } = useContext(ThemeModeContext) ?? {};

    // States
    const [blocks, setBlocks] = useState<Block[]>([]);

    useEffect(() => {
        if (graffiti) {
            getBlocks();
        }
    }, [graffiti]);

    const getBlocks = async () => {
        try {
            const response = await axiosClient.get(`/api/validator-rewards-summary/blocks/graffiti/${graffiti}`);
            setBlocks(response.data.blocks);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Layout>
            <h1 className='text-center text-white'>Graffiti Search Result</h1>

            <div className='flex flex-col justify-center gap-y-4 max-w-[700px] mx-auto mt-8'>
                {blocks.map(block => (
                    <Link
                        key={block.f_slot}
                        href={{
                            pathname: '/slot/[id]',
                            query: {
                                id: block.f_slot,
                            },
                        }}
                        passHref
                        as={`/slot/${block.f_slot}`}
                    >
                        <div
                            className='flex flex-col gap-x-1 justify-around items-center text-xs text-black rounded-[22px] px-2 xl:px-8 py-3 cursor-pointer'
                            style={{
                                backgroundColor: themeMode?.darkMode ? 'var(--yellow2)' : 'var(--blue1)',
                                boxShadow: themeMode?.darkMode ? 'var(--boxShadowYellow1)' : 'var(--boxShadowBlue1)',
                            }}
                        >
                            <p>Block: {block.f_slot}</p>
                            <p>Graffiti: {block.f_graffiti}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </Layout>
    );
};

export default SlotGraffitiSearch;

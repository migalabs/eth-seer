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
import Graffitis from '../../../components/layouts/Graffitis';

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
            <Graffitis />
        </Layout>
    );
};

export default SlotGraffitiSearch;

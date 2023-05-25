import React from 'react';

// Components
import Layout from '../components/layouts/Layout';
import EntityCard from '../components/ui/EntitiyCard';

// Constants
import { POOLS } from '../constants';

const Entities = () => {
    return (
        <Layout>
            <h1 className='uppercase text-center text-3xl text-white'>List of Entities</h1>

            <div
                className='grid gap-4 max-w-[1200px] mx-auto mt-4'
                style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}
            >
                {POOLS.map((pool, index) => (
                    <EntityCard key={pool} index={index + 1} pool={pool} />
                ))}
            </div>
        </Layout>
    );
};

export default Entities;

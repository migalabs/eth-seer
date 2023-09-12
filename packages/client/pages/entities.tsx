import React from 'react';

// Components
import Layout from '../components/layouts/Layout';
import EntityCard from '../components/ui/EntitiyCard';
import CustomImage from '../components/ui/CustomImage';

// Constants
import { POOLS } from '../constants';

const Entities = () => {
    return (
        <Layout>
            <h1 className='uppercase text-center text-2xl text-white'>List of Entities</h1>
            <div className="mx-auto py-4 px-6 bg-white/30 border-2 border-dashed rounded-xl flex w-11/12 lg:w-3/5 my-3">
                <CustomImage
                    src='/static/images/info.webp'
                    alt='More information icon'
                    width={50}
                    height={50}
                    className='object-contain relative bottom-4 right-2'
                />
                <h3 className='text-white text-xs text-center'>
                An entity can range from an individual validator to a validators organization, as long as they meet the requirements to be validators of the Blockchain. Ethseer obtains information about the entities to which validators belong to through graffiti.
                </h3>
            </div>

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

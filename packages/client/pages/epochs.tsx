import React from 'react';

// Components
import Layout from '../components/layouts/Layout';
import Statitstics from '../components/layouts/Statitstics';
import CustomImage from '../components/ui/CustomImage';

const Epochs = () => {
    return (
        <Layout>
            <h2 className='text-lg text-white text-center md:text-2xl uppercase mb-3'>Epochs</h2>
            <div className="mx-auto py-4 px-6 bg-white/30 border-2 border-dashed rounded-xl flex w-11/12 lg:w-3/5 mb-5">
                <CustomImage
                    src='/static/images/info.webp'
                    alt='More information icon'
                    width={50}
                    height={50}
                    className='object-contain relative bottom-4 right-2'
                />
                <h3 className='text-white text-xs text-center'>
                Epochs in Ethereum refer to a specific period of time in the Beacon Chain. Each epoch has a duration of 6.4 minutes and is composed of 32 slots.
                </h3>
            </div>
            <Statitstics />
        </Layout>
    );
};

export default Epochs;

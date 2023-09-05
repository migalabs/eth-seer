import React from 'react';

// Components
import Layout from '../components/layouts/Layout';
import Statitstics from '../components/layouts/Statitstics';

const Epochs = () => {
    return (
        <Layout>
            <div className='my-6 text-center text-white mt-14 xl:mt-0'>
                <h1 className='text-lg md:text-3xl uppercase mb-3'>Epochs</h1>

                <Statitstics />
            </div>
        </Layout>
    );
};

export default Epochs;

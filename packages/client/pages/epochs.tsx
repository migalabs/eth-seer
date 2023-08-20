import React from 'react';

// Components
import Layout from '../components/layouts/Layout';
import Statitstics from '../components/layouts/Statitstics';

const Epochs = () => {
    return (
        <Layout>
            <h1 className='uppercase text-center text-3xl text-white mb-6'>Entities</h1>

            <Statitstics />
        </Layout>
    );
};

export default Epochs;

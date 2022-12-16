import ChainOverview from '../components/layouts/ChainOverview';
import Layout from '../components/layouts/Layout';
import Statitstics from '../components/layouts/Statitstics';

export default function Home() {
    return (
        <Layout>
            <ChainOverview />

            <div className='mt-3'>
                <Statitstics />
            </div>
        </Layout>
    );
}

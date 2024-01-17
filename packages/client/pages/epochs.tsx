import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

// Axios
import axiosClient from '../config/axios';

// Components
import Layout from '../components/layouts/Layout';
import EpochList from '../components/layouts/Epochs';
import Pagination from '../components/ui/Pagination';
import Title from '../components/ui/Title';
import PageDescription from '../components/ui/PageDescription';

const Epochs = () => {
    // Router
    const router = useRouter();
    const { network } = router.query;

    // States
    const [loading, setLoading] = useState(true);
    const [epochs, setEpochs] = useState([]);
    const [epochsCount, setEpochsCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [numRowsQuery, setNumRowsQuery] = useState(0);

    useEffect(() => {
        if (network && epochs.length === 0) {
            getEpochs(0, 10);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [network]);

    const getEpochs = async (page: number, limit: number) => {
        try {
            setLoading(true);

            setCurrentPage(page);
            setNumRowsQuery(limit);

            const response = await axiosClient.get('/api/epochs', {
                params: {
                    network,
                    page,
                    limit,
                },
            });

            setEpochs(response.data.epochsStats);
            setEpochsCount(response.data.totalCount);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout hideMetaDescription>
            <Head>
                <title>Epochs of the Ethereum Beacon Chain - EthSeer.io</title>
                <meta
                    name='description'
                    content='Check the Ethereum chain epochs, how many blocks were proposed and missed, the attestation participation and the validators active rate.'
                />
                <meta name='keywords' content='Ethereum, Epochs, Timeframes, Security, Validators, Consensus' />
                <link rel='canonical' href='https://ethseer.io/epochs' />
            </Head>

            <Title>Ethereum Epochs</Title>

            <PageDescription>
                Epochs in Ethereum refer to a specific period of time in the Beacon Chain. Each epoch is composed of 32
                slots and has a duration of 6.4 minutes.
            </PageDescription>

            {epochsCount > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(epochsCount / numRowsQuery)}
                    onChangePage={page => getEpochs(page, numRowsQuery)}
                    onChangeNumRows={numRows => getEpochs(0, numRows)}
                />
            )}

            <EpochList epochs={epochs} fetchingEpochs={loading} />
        </Layout>
    );
};

export default Epochs;

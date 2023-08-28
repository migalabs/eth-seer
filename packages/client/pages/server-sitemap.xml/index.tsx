import { GetServerSideProps } from 'next';
import { getServerSideSitemapLegacy, ISitemapField } from 'next-sitemap';

// Constants
const limit = 10000;
const webUrl = 'http://localhost:3000';
const apiUrl = 'http://localhost:4000';

import { POOLS_EXTENDED } from '../../constants';

export const getServerSideProps: GetServerSideProps = async ctx => {
    const [entities, epochs, slots, validators] = await Promise.all([
        getServerSidePropsEntities(),
        getServerSidePropsEpochs(),
        getServerSidePropsSlots(),
        getServerSidePropsValidators(),
    ]);

    const fields: ISitemapField[] = [...entities, ...epochs, ...slots, ...validators];

    return getServerSideSitemapLegacy(ctx, fields);
};

const getServerSidePropsEntities = async () => {
    console.log('Entities', POOLS_EXTENDED.length);
    return POOLS_EXTENDED.map(pool => ({
        loc: `${webUrl}/entities/${pool.toLowerCase()}`,
        lastmod: new Date().toISOString(),
    }));
};

const getServerSidePropsEpochs = async () => {
    const response = await fetch(`${apiUrl}/api/epochs/stats`);
    const data = await response.json();

    const { first, last, count } = data.stats;

    console.log('Epochs', count);

    const fields: ISitemapField[] = [];

    let i = last;

    while (i >= first && fields.length < limit) {
        fields.push({
            loc: `${webUrl}/epochs/${i}`,
            lastmod: new Date().toISOString(),
        });

        i--;
    }

    return fields;
};

const getServerSidePropsSlots = async () => {
    const response = await fetch(`${apiUrl}/api/slots/stats`);
    const data = await response.json();

    const { first, last, count } = data.stats;

    console.log('Slots', count);

    const fields: ISitemapField[] = [];

    let i = last;

    while (i >= first && fields.length < limit) {
        fields.push({
            loc: `${webUrl}/slots/${i}`,
            lastmod: new Date().toISOString(),
        });

        i--;
    }

    return fields;
};

const getServerSidePropsValidators = async () => {
    const response = await fetch(`${apiUrl}/api/validators/stats`);
    const data = await response.json();

    const { first, last, count } = data.stats;

    console.log('Validators', count);

    const fields: ISitemapField[] = [];

    let i = last;

    while (i >= first && fields.length < limit) {
        fields.push({
            loc: `${webUrl}/validators/${i}`,
            lastmod: new Date().toISOString(),
        });

        i--;
    }

    return fields;
};

export default function ServerSitemapXml() {}

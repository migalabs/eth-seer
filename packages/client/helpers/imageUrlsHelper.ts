// Constants
import { POOLS, CLIENTS } from '../constants';

export const getImageUrlEntity = (poolName?: string) => {
    if (poolName && POOLS.includes(poolName.toUpperCase())) {
        return `/static/images/blocks/cubes/${poolName.toLowerCase()}.webp`;
    } else if (poolName && poolName.toLowerCase().includes('lido')) {
        return '/static/images/blocks/cubes/lido.webp';
    } else if (poolName && poolName.toLowerCase().includes('whale')) {
        return '/static/images/blocks/cubes/whale-ethereum-entity.webp';
    } else {
        return '/static/images/blocks/cubes/unknown-ethereum-entity.webp';
    }
};

export const getImageAltEntity = (poolName?: string) => {
    if (poolName && POOLS.includes(poolName.toUpperCase())) {
        return `${poolName} entity logo`;
    } else {
        return 'others entity logo';
    }
};

export const getImageUrlClient = (clientName?: string) => {
    if (clientName && CLIENTS.find(client => client.name.toUpperCase() === clientName.toUpperCase())) {
        return `/static/images/blocks/cubes/clients/${clientName.toLowerCase()}.webp`;
    } else {
        return '/static/images/blocks/cubes/unknown-ethereum-entity.webp';
    }
};

export const getImageAltClient = (clientName?: string) => {
    if (clientName && CLIENTS.find(client => client.name.toUpperCase() === clientName.toUpperCase())) {
        return `${clientName} client logo`;
    } else {
        return 'others client logo';
    }
};

export const getImageUrlLanguage = (language: string) => {
    return `/static/images/programming_languages/${language.toLowerCase()}.webp`;
};

export const getImageAltLanguage = (language: string) => {
    return `${language} programming language logo`;
};

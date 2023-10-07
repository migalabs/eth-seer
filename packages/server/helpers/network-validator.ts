import { pgPools } from "../config/db";

export const existsNetwork = (network: string) => {
    if (pgPools[network] === undefined) { 
        throw new Error('Network not found');
    }

    return true;
}
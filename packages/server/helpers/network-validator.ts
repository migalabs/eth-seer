import { clickhouseClients } from "../config/db";

export const existsNetwork = (network: string) => {
    if (clickhouseClients[network] === undefined) { 
        throw new Error('Network not found');
    }

    return true;
}
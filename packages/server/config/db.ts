import { Pool } from 'pg';
import { EventEmitter } from 'node:events';
import { ClickHouseClient, createClient } from '@clickhouse/client';
import dotenv from 'dotenv';

dotenv.config();

export const pgPools = {};

export const clickhouseClients: Record<string, ClickHouseClient> = {};

export const dbConnection = async () => {

    try {

        const networks = JSON.parse(process.env.NETWORKS);

        if (!networks) {
            throw new Error('No networks found');
        }

        for (const network of networks) {
            pgPools[network.network] = new Pool({
                user: network.user || '',
                host: network.host || '',
                database: network.name || '',
                password: network.password || '',
                port: Number(network.port) || 0
            });

            startListeners(network.network);
        }

        const networksClickhouse = JSON.parse(process.env.NETWORKS_CLICKHOUSE);

        if (!networksClickhouse) {
            throw new Error('No networks found');
        }

        for (const network of networksClickhouse) {
            clickhouseClients[network.network] = createClient({
                host: network.host,
                username: network.user,
                password: network.password,
                database: network.name,
            });
        }

        console.log('Database connected');

    } catch (error) {
        console.log(error);
        throw new Error('Error when trying to connect to the DB');
    }
}

class MyEmitter extends EventEmitter {}
export const pgListeners = {};

const startListeners = async (network: string) => {
    
    const client = await pgPools[network].connect();
    pgListeners[network] = new MyEmitter();

    client.query('LISTEN new_head');
    client.query('LISTEN new_epoch_finalized');

    client.on('notification', (msg) => {
        if (msg.channel === 'new_head') {
            pgListeners[network].emit('new_head', msg);
        } else if (msg.channel === 'new_epoch_finalized') {
            pgListeners[network].emit('new_epoch_finalized', msg);
        }
    });
}
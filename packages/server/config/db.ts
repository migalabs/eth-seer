import { ClickHouseClient, ClickHouseLogLevel, createClient } from '@clickhouse/client';
import dotenv from 'dotenv';

dotenv.config();

export const clickhouseClients: Record<string, ClickHouseClient> = {};

export const dbConnection = async () => {
    try {
        const networks = JSON.parse(process.env.NETWORKS);

        if (!networks) {
            throw new Error('No networks found');
        }

        for (const network of networks) {
            clickhouseClients[network.network] = createClient({
                host: network.host,
                username: network.user,
                password: network.password,
                database: network.name,
                clickhouse_settings: {
                    output_format_json_quote_64bit_integers: 0,
                },
                log: {
                    level: process.env.CLICKHOUSE_TRACE === 'True' ? ClickHouseLogLevel.TRACE : ClickHouseLogLevel.OFF,
                },
            });
        }

        console.log('Database connected');
    } catch (error) {
        console.log(error);
        throw new Error('Error when trying to connect to the DB');
    }
};

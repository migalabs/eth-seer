import { createClient } from '@clickhouse/client';
import dotenv from 'dotenv';

dotenv.config();

const client = createClient({
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

interface Table {
    name: string;
}

interface Column {
    name: string;
    type: string;
}

const fetchTables = async (): Promise<Table[]> => {

    const resultSet = await client.query({
        query: 'SHOW TABLES',
        format: 'JSONEachRow',
    });

    return resultSet.json();
}

const fetchColumns = async (table: string): Promise<Column[]> => {
    
    const resultSet = await client.query({
        query: `DESCRIBE ${table}`,
        format: 'JSONEachRow',
    });

    return resultSet.json();
}

const printSchema = async () => {

    const tables = await fetchTables();

    console.log('Database Schema:\n');

    for (const table of tables) {

        console.log(`-  ${table.name}`);

        const columns = await fetchColumns(table.name);

        for (const column of columns) {
            console.log(`  -  ${column.name} (${column.type})`);
        }
    }
};

printSchema();
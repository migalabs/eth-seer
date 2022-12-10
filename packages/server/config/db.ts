import Pool from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool.Pool({
    user: process.env.DB_USER || '',
    host: process.env.DB_HOST || '',
    database: process.env.DB_NAME || '',
    password: process.env.DB_PASSWORD || '',
    port: Number(process.env.DB_PORT) || 0
});

export const dbConnection = async () => {

    try {

        await pool.connect();

        console.log('Database connected');

    } catch (error) {
        console.log(error);
        throw new Error('Error when trying to connect to the DB');
    }
}

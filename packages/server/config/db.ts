import { Client } from 'pg';
import { EventEmitter } from 'node:events';
import dotenv from 'dotenv';

dotenv.config();

export const pgClient = new Client({
    user: process.env.DB_USER || '',
    host: process.env.DB_HOST || '',
    database: process.env.DB_NAME || '',
    password: process.env.DB_PASSWORD || '',
    port: Number(process.env.DB_PORT) || 0
});

export const dbConnection = async () => {

    try {

        await pgClient.connect();

        console.log('Database connected');

    } catch (error) {
        console.log(error);
        throw new Error('Error when trying to connect to the DB');
    }
}

class MyEmitter extends EventEmitter {}
export const pgListener = new MyEmitter();

const startListeners = async () => {
    
    pgClient.query('LISTEN new_head');
    pgClient.query('LISTEN new_epoch_finalized');

    pgClient.on('notification', (msg) => {
        if (msg.channel === 'new_head') {
            pgListener.emit('new_head', msg);
        } else if (msg.channel === 'new_epoch_finalized') {
            pgListener.emit('new_epoch_finalized', msg);
        }
    });
}

startListeners();
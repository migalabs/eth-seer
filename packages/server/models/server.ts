import express, { Application } from 'express';
import cors from 'cors';
import { dbConnection } from '../config/db';

import entitiesRoutes from '../routes/entities';
import epochsRoutes from '../routes/epochs';
import slotsRoutes from '../routes/slots';
import blocksRoutes from '../routes/blocks';
import validatorsRoutes from '../routes/validators';
import networksRoutes from '../routes/networks';
import transactionsRoutes from '../routes/transactions';
import slashedValidatorsRoutes from '../routes/slashedValidators';

class Server {

    private app: Application;
    private ip: string;
    private port: number;
    private paths = {
        entities: '/api/entities',
        epochs: '/api/epochs',
        slots: '/api/slots',
        blocks: '/api/blocks',
        validators: '/api/validators',
        networks: '/api/networks',
        transactions: '/api/transactions',
        slashedValidators: '/api/slashedValidators',
    };
    private callsVerbose: boolean;

    constructor() {
        this.app = express();
        this.ip = process.env.API_LISTEN_IP || '127.0.0.1';
        this.port = Number(process.env.API_LISTEN_PORT) || 4000;
        this.callsVerbose = process.env.CALLS_VERBOSE === 'True';

        // Connect to the database
        this.connectDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi apliación
        this.routes();
    }

    async connectDB() {
        await dbConnection();
    }
    
    middlewares() {

        // CORS
        this.app.use(cors());

        // Parse body from json
        this.app.use(express.json());

        if (this.callsVerbose) {
            // Show the queries in the terminal
            this.app.use('/', (req, res, next) => {
                console.log(`${req.method} - ${req.url}`);
                next();
            });
        }
    }

    routes() {
        this.app.use(this.paths.entities, entitiesRoutes);
        this.app.use(this.paths.epochs, epochsRoutes);
        this.app.use(this.paths.slots, slotsRoutes);
        this.app.use(this.paths.blocks, blocksRoutes);
        this.app.use(this.paths.validators, validatorsRoutes);
        this.app.use(this.paths.networks, networksRoutes);
        this.app.use(this.paths.transactions, transactionsRoutes);
        this.app.use(this.paths.slashedValidators, slashedValidatorsRoutes);
    }

    listen() {
        this.app.listen(this.port, this.ip, () => {
            console.log(`Server running on ${this.ip}:${this.port}`);
        });
    }
}

export default Server;
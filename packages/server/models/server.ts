import express, { Application } from 'express';
import cors from 'cors';
import { dbConnection } from '../config/db';
import validatorReardsSummaryRoutes from '../routes/validator-rewards-summary';

class Server {

    private app: Application;
    private ip: string;
    private port: number;
    private paths = {
        validatorRewardsSummary: '/api/validator-rewards-summary'
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
        this.app.use(this.paths.validatorRewardsSummary, validatorReardsSummaryRoutes);
    }

    listen() {
        this.app.listen(this.port, this.ip, () => {
            console.log(`Server running on ${this.ip}:${this.port}`);
        });
    }
}

export default Server;
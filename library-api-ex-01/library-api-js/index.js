import express from 'express';
import * as dotenv from 'dotenv';
import { AuthorRoutes } from './routes/author-routes.js'
import { BookRoutes } from './routes/book-routes.js';
import { mongoose } from 'mongoose';
import cors from 'cors';
import { pino } from 'pino'

dotenv.config();
const app = express();

const port = process.env.PORT || 3000;
const mongoConnString = process.env.MONGODB_ATLAS_URL; 
const logger = pino();

//Connecting to MongoDB
mongoose.connect(mongoConnString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    logger.info("Connected to the database!");
}).catch(err => {
  logger.error(`Error occured while connecting to the databse. Error Message ${err.message}`);
  process.exit();
});

//Setting middleware
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Registering routes
app.use('/', AuthorRoutes);
app.use('/', BookRoutes);

// Initializing server
app.listen(port, function() {
    logger.info(`Library API Running on Port ${process.env.PORT}`);
});
import express from 'express';
import * as dotenv from 'dotenv';
import { libraryRoutes } from './routes/library-routes.js'
import { mongoose } from 'mongoose'
import cors from 'cors'

dotenv.config();
const app = express();

const port = process.env.PORT || 3000;
const mongoConnString = process.env.MONGODB_ATLAS_URL; 

//Connecting to MongoDB
mongoose.connect(mongoConnString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to the database!");
}).catch(err => {
  console.log(`Error occured while connecting to the databse. Error Message ${err.message}`);
  process.exit();
});

//Setting middleware
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());   
//Registering routes
app.use('/', libraryRoutes);

// Initializing server
app.listen(port, function() {
    console.log(`Library API Running on Port ${process.env.PORT}`);
});
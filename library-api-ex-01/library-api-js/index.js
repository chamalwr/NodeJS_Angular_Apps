import express from 'express';
import * as dotenv from 'dotenv';
dotenv.config();
const app = express();

const port = process.env.PORT || 3000;

app.listen(port, function() {
    console.log(`Library API Running on Port ${process.env.PORT}`);
});
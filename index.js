import express from 'express';
import dotenv from 'dotenv';
import { body, validationResult } from 'express-validator';
import cors from 'cors';
import bodyParser from 'body-parser';
import User from './models/User.js';

dotenv.config();


const app = express();

app.use(cors());
app.use(bodyParser.json());

const corsOptions = { 
  origin: process.env.CORS_ORIGIN,  
  optionsSuccessStatus: 200,
};


const PORT = process.env.PORT || 5005;   




// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
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


const PORT = process.env.PORT 


// Connect to MongoDB por string
const mongoDBUrl = process.env.MONGODB_URI 

if (!mongoDBUrl) {
  throw new Error('MONGODB_URI environment variable is not defined');
}

mongoose.connect(mongoDBUrl, {
});

const db = mongoose.connection;
db.on('error', (error) => {
  console.error('Erro ao conectar ao MongoDB:', error.message);
  process.exit(1);
});
db.once('open', () => {
  console.log('Conexão com o MongoDB estabelecida com sucesso');
});






// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
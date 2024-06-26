import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import bodyParser from 'body-parser';
import User from './models/User.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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



//Rota para teste
app.get('/', (req, res) => {
  res.json({ message: 'API de autenticação de usuários' });
});




// Rota de cadastro
app.post('/cadastro', [
  // Validação dos campos
  body('nome').isLength({ min: 1 }),
  body('email').isEmail(),
  body('senha').isLength({ min: 6 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Verifica se o email já está em uso
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email já está em uso.' });
    }

    // Criptografa a senha antes de salvar no banco de dados
    const hashedPassword = await bcrypt.hash(req.body.senha, 10);

    // Cria um novo usuário
    const user = new User({
      nome: req.body.nome,
      email: req.body.email,
      senha: hashedPassword,
    });

    // Salva o usuário no banco de dados
    await user.save();

    res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (error) {
    console.error('Erro no servidor:', error);
    res.status(500).json({ message: 'Erro interno no servidor.', error: error.message });
  }
});


// Rota de login
app.post('/login', async (req, res) => {
  try {
    // Verifica se o usuário existe
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: 'Usuário não encontrado.' });
    }

    // Verifica se a senha está correta
    const isPasswordValid = await bcrypt.compare(req.body.senha, user.senha);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Senha inválida.' });
    }

    // Cria um token JWT
    const token = jwt.sign({ id: user._id }, 'seu segredo', { expiresIn: '1h' });

    res.json({ message: 'Login bem-sucedido!', token: token });
  } catch (error) {
    console.error('Erro no servidor:', error);
    res.status(500).json({ message: 'Erro interno no servidor.', error: error.message });
  }
});



// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
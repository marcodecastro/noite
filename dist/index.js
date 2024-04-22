import express from 'express';
import nodemon from 'nodemon';
const app = express();

// Cria uma rota para teste
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Inicia o servidor
app.listen(5000, () => {
  console.log('Server started on http://localhost:5000');
});
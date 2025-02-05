import express from 'express'
import userRoutes from './src/routes/userRoutes.js';

const app = express()

const PORT = process.env.PORT || 3000; // Define a porta, usando uma variável de ambiente ou 3000 como padrão

app.use(express.json())

app.get('/', (req, res) => {
    res.send('API está funcionando!')
})

app.use('/api', userRoutes)

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

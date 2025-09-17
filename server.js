const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Rota principal
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'RestaurantePro SaaS API v2.0',
        version: '2.0.0',
        status: 'online',
        timestamp: new Date().toISOString(),
        endpoints: [
            '/api/auth/register',
            '/api/auth/login', 
            '/api/produtos',
            '/api/pedidos'
        ]
    });
});

// Rota de teste
app.get('/test', (req, res) => {
    res.json({
        message: 'API funcionando!',
        datetime: new Date(),
        server: 'Render.com'
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log('✨ RestaurantePro SaaS iniciado!');
});

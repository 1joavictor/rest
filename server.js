const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

// Importar banco de dados
const { sequelize } = require('./models/database');

// Importar rotas
const authRoutes = require('./routes/auth');
const restauranteRoutes = require('./routes/restaurante');
const produtoRoutes = require('./routes/produtos');
const pedidoRoutes = require('./routes/pedidos');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/restaurante', restauranteRoutes);
app.use('/api/produtos', produtoRoutes);
app.use('/api/pedidos', pedidoRoutes);

// Rota principal
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'RestaurantePro SaaS API v2.0',
        version: '2.0.0',
        status: 'online',
        timestamp: new Date().toISOString(),
        endpoints: [
            'POST /api/auth/register',
            'POST /api/auth/login',
            'GET /api/auth/me',
            'GET /api/restaurante',
            'POST /api/restaurante', 
            'GET /api/produtos',
            'POST /api/produtos',
            'GET /api/pedidos',
            'POST /api/pedidos'
        ]
    });
});

// Rota de dashboard (serve HTML)
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});

// Inicializar banco de dados
async function initializeDatabase() {
    try {
        await sequelize.sync();
        console.log('✅ Banco de dados sincronizado');
    } catch (error) {
        console.error('❌ Erro no banco de dados:', error);
    }
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    await initializeDatabase();
    console.log('✨ RestaurantePro SaaS iniciado com sucesso!');
});

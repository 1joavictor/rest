const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario, Restaurante } = require('../database');
const auth = require('../auth');
const router = express.Router();

// Registrar usuário
router.post('/register', async (req, res) => {
    try {
        const { nome, email, password, telefone } = req.body;

        const existingUser = await Usuario.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email já cadastrado'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const usuario = await Usuario.create({
            nome,
            email,
            password: hashedPassword,
            telefone
        });

        const token = jwt.sign(
            { userId: usuario.id, email: usuario.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            success: true,
            message: 'Usuário criado com sucesso',
            data: {
                token,
                user: {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email,
                    plano: usuario.plano
                }
            }
        });

    } catch (error) {
        console.error('Erro no registro:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const usuario = await Usuario.findOne({ 
            where: { email },
            include: [{ model: Restaurante }]
        });

        if (!usuario) {
            return res.status(401).json({
                success: false,
                message: 'Credenciais inválidas'
            });
        }

        const isValidPassword = await bcrypt.compare(password, usuario.password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Credenciais inválidas'
            });
        }

        const token = jwt.sign(
            { userId: usuario.id, email: usuario.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Login realizado com sucesso',
            data: {
                token,
                user: {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email,
                    plano: usuario.plano,
                    restaurante: usuario.Restaurante
                }
            }
        });

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Verificar token
router.get('/me', auth, async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.user.userId, {
            include: [{ model: Restaurante }],
            attributes: { exclude: ['password'] }
        });

        res.json({
            success: true,
            data: { user: usuario }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

module.exports = router;


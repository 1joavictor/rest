const express = require('express');
const { Restaurante } = require('../models/database');
const auth = require('../middleware/auth');
const router = express.Router();

// Buscar restaurante do usuário
router.get('/', auth, async (req, res) => {
    try {
        const restaurante = await Restaurante.findOne({
            where: { user_id: req.user.userId }
        });

        res.json({
            success: true,
            data: { restaurante }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Criar/Atualizar restaurante
router.post('/', auth, async (req, res) => {
    try {
        const dados = {
            user_id: req.user.userId,
            ...req.body
        };

        let restaurante = await Restaurante.findOne({
            where: { user_id: req.user.userId }
        });

        if (restaurante) {
            await restaurante.update(dados);
        } else {
            restaurante = await Restaurante.create(dados);
        }

        res.json({
            success: true,
            message: 'Restaurante salvo com sucesso',
            data: { restaurante }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

module.exports = router;

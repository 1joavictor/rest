const express = require('express');
const { Pedido, Restaurante } = require('../models/database');
const auth = require('../middleware/auth');
const router = express.Router();

// Listar pedidos
router.get('/', auth, async (req, res) => {
    try {
        const restaurante = await Restaurante.findOne({
            where: { user_id: req.user.userId }
        });

        if (!restaurante) {
            return res.status(404).json({
                success: false,
                message: 'Restaurante não encontrado'
            });
        }

        const pedidos = await Pedido.findAll({
            where: { restaurante_id: restaurante.id },
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            data: { pedidos }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Criar pedido
router.post('/', auth, async (req, res) => {
    try {
        const restaurante = await Restaurante.findOne({
            where: { user_id: req.user.userId }
        });

        if (!restaurante) {
            return res.status(404).json({
                success: false,
                message: 'Restaurante não encontrado'
            });
        }

        const numero_pedido = `PED${Date.now()}`;

        const pedido = await Pedido.create({
            restaurante_id: restaurante.id,
            numero_pedido,
            ...req.body
        });

        res.status(201).json({
            success: true,
            message: 'Pedido criado com sucesso',
            data: { pedido }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Atualizar status do pedido
router.patch('/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body;
        
        const restaurante = await Restaurante.findOne({
            where: { user_id: req.user.userId }
        });

        const pedido = await Pedido.findOne({
            where: { 
                id: req.params.id,
                restaurante_id: restaurante.id
            }
        });

        if (!pedido) {
            return res.status(404).json({
                success: false,
                message: 'Pedido não encontrado'
            });
        }

        await pedido.update({ status });

        res.json({
            success: true,
            message: 'Status atualizado com sucesso',
            data: { pedido }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

module.exports = router;

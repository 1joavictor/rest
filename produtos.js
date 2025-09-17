const express = require('express');
const { Produto, Restaurante } = require('../models/database');
const auth = require('../middleware/auth');
const router = express.Router();

// Listar produtos
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

        const produtos = await Produto.findAll({
            where: { restaurante_id: restaurante.id },
            order: [['nome', 'ASC']]
        });

        res.json({
            success: true,
            data: { produtos }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Criar produto
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

        const produto = await Produto.create({
            restaurante_id: restaurante.id,
            ...req.body
        });

        res.status(201).json({
            success: true,
            message: 'Produto criado com sucesso',
            data: { produto }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// Atualizar produto
router.put('/:id', auth, async (req, res) => {
    try {
        const restaurante = await Restaurante.findOne({
            where: { user_id: req.user.userId }
        });

        const produto = await Produto.findOne({
            where: { 
                id: req.params.id,
                restaurante_id: restaurante.id
            }
        });

        if (!produto) {
            return res.status(404).json({
                success: false,
                message: 'Produto não encontrado'
            });
        }

        await produto.update(req.body);

        res.json({
            success: true,
            message: 'Produto atualizado com sucesso',
            data: { produto }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

module.exports = router;

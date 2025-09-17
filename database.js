const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../../database.sqlite'),
    logging: false,
    define: {
        underscored: true,
        timestamps: true
    }
});

// Modelo Usuario
const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    telefone: DataTypes.STRING,
    plano: {
        type: DataTypes.ENUM('freemium', 'basico', 'intermediario', 'avancado'),
        defaultValue: 'freemium'
    },
    ativo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});

// Modelo Restaurante
const Restaurante = sequelize.define('Restaurante', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    endereco: DataTypes.TEXT,
    telefone: DataTypes.STRING,
    email: DataTypes.STRING,
    tipo_cozinha: DataTypes.STRING,
    taxa_entrega: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    }
});

// Modelo Produto
const Produto = sequelize.define('Produto', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    restaurante_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descricao: DataTypes.TEXT,
    preco: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    categoria: DataTypes.STRING,
    disponivel: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});

// Modelo Pedido
const Pedido = sequelize.define('Pedido', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    restaurante_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    numero_pedido: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    cliente_nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cliente_telefone: DataTypes.STRING,
    status: {
        type: DataTypes.ENUM('recebido', 'preparando', 'pronto', 'entregue'),
        defaultValue: 'recebido'
    },
    valor_total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    canal: {
        type: DataTypes.ENUM('proprio', 'ifood', 'ubereats'),
        defaultValue: 'proprio'
    }
});

// Relacionamentos
Usuario.hasOne(Restaurante, { foreignKey: 'user_id' });
Restaurante.belongsTo(Usuario, { foreignKey: 'user_id' });
Restaurante.hasMany(Produto, { foreignKey: 'restaurante_id' });
Restaurante.hasMany(Pedido, { foreignKey: 'restaurante_id' });

module.exports = {
    sequelize,
    Usuario,
    Restaurante,
    Produto,
    Pedido
};

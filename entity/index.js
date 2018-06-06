const sequelize = require('sequelize');
const sequelizeInstance = require('../service/sequelizeService');

const user = sequelizeInstance.define('user', {
    status: { type: sequelize.BOOLEAN, allowNull: true, defaultValue : 1 }, // 1. 정상, 0. 정지
    sex: { type: sequelize.BOOLEAN, allowNull: true, defaultValue : 1 }, // 1. 남자, 0. 여자
    name: { type: sequelize.STRING(30), allowNull: false },
    nickname: { type: sequelize.STRING(50), allowNull: true },
    phone: { type: sequelize.STRING(15), allowNull: true },
    follwing: { type: sequelize.SMALLINT.UNSIGNED, allowNull: true },
    follwed: { type: sequelize.SMALLINT.UNSIGNED, allowNull: true },
    imagePath: { type: sequelize.STRING(300), allowNull: true },
    imageNames: { type: sequelize.STRING(300), allowNull: true },
    loginedAt: { type: sequelize.DATE, allowNull: true }
});

const product = sequelizeInstance.define('product', {
    name: { type: sequelize.STRING(30), allowNull: false },
    price: { type: sequelize.STRING(30), allowNull: false },
});

const basket = sequelizeInstance.define('basket', {
    user_id: { type : sequelize.INTEGER(11), allowNull : false },
    product_id: { type : sequelize.INTEGER(11), allowNull : false },
    name: { type: sequelize.STRING(30), allowNull: false },
    price: { type: sequelize.STRING(30), allowNull: false },
});

module.exports = {
  user,
  product,
  basket
};

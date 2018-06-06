const { user, product, basket  } = require('../entity');

const EntityService = {};

// Sequelize Service (ORM) 참조용

EntityService.Init = () => {
  user.hasMany(basket, { foreignKey : 'user_id', onUpdate : 'CASCADE' });
  product.hasMany(basket, { foreignKey : 'product_id', onUpdate : 'CASCADE' });

  user.sync()
  .then(product.sync()
  .then(basket.sync()))
}

module.exports = EntityService;

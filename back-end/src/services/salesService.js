const { sequelize, Product, Sale, SalesProduct } = require('../database/models');

const getAllProducts = async () => {
  const data = await Product.findAll();
  return data;
};

const addNewSale = ({
products, userId, sellerId, totalPrice, deliveryAddress, deliveryNumber }) => {
  try {
    return sequelize.transaction(async (t) => {
      const newOrder = await Sale.create({
        userId, sellerId, totalPrice, deliveryAddress, deliveryNumber,
      }, { transaction: t });

      await SalesProduct.bulkCreate(products.map((product) => ({
        saleId: newOrder.id,
        productId: product.id,
        quantity: product.quantity,
      })), { transaction: t });
    
      return newOrder;
    });  
  } catch (error) {
    console.log('ERRO', error);
    throw error;
  }
};

const findSaleById = async (id) => {
//   const { dataValues } = await models.SalesProduct.findAll({
//       where: { saleId: id },
//     },
//     {
//       include: [
//         {
//           model: models.Sale,
//           as: 'sale',
//           through: { attributes: [] },
//         },
//         {
//           model: models.Product,
//           as: 'products',
//           through: { attributes: [] },
//         },
//       ],
//   });
//   return dataValues;
  const { dataValues } = await Sale.findByPk(id, {
    include: [
      {
        model: Product,
        as: 'products',
        through: { attributes: ['quantity'] },
      },
    ],
  });

  // const productsList = dataValues.products.map((product) => {
  //   const updatedProduct = { ...product };
  //   updatedProduct.dataValues.quantity = product.SalesProduct.quantity;
  //   delete updatedProduct.dataValues.SalesProduct;
  //   return updatedProduct.dataValues;
  // });
  // console.log(dataValues.products);
  // dataValues.products = productsList;

  return dataValues;
};

module.exports = { getAllProducts, addNewSale, findSaleById };

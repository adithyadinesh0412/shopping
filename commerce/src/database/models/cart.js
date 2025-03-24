'use strict'
module.exports = (sequelize, DataTypes) => {
	const Cart = sequelize.define(
		'Cart',
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				field: 'user_id',
			},
			productId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: false,
				field: 'product_id',
			}
		},
		{ sequelize, modelName: 'Cart', tableName: 'cart', freezeTableName: true, paranoid: true }
	)
	
	return Cart
}

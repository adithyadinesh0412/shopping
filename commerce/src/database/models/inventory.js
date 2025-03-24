'use strict'
module.exports = (sequelize, DataTypes) => {
	const Inventory = sequelize.define(
		'Inventory',
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			item: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			stock: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: false,
			},
			price_per_item: {
				type: DataTypes.DECIMAL(10,2),
				allowNull: false,
			},
			created_by: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			updated_by: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{ sequelize, modelName: 'Inventory', tableName: 'inventory', freezeTableName: true, paranoid: true }
	)
	
	return Inventory
}

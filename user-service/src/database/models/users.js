'use strict'
module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define(
		'User',
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			email_verified: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: false,
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			location: DataTypes.STRING,
			about: DataTypes.TEXT,
			status: {
				type: DataTypes.STRING,
				defaultValue: 'ACTIVE',
			},
			image: DataTypes.STRING,
			has_accepted_terms_and_conditions: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
			languages: DataTypes.ARRAY(DataTypes.STRING),
			preferred_language: {
				type: DataTypes.STRING,
				defaultValue: 'en',
			},
			meta: {
				type: DataTypes.JSONB,
				allowNull: true,
			},
		},
		{ sequelize, modelName: 'User', tableName: 'users', freezeTableName: true, paranoid: true }
	)
	
	return User
}

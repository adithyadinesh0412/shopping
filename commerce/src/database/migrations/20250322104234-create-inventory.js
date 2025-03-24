'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('inventory', {
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			item: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			stock: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			price_per_item: {
				type: Sequelize.DECIMAL(10,2),
				allowNull: false,
			},
			status: {
				type: Sequelize.STRING,
				allowNull: false,
				defaultValue: 'IN-STOCK',
			},
			created_by: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			updated_by: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			created_at: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updated_at: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			deleted_at: {
				type: Sequelize.DATE,
			},
		})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('inventory')
  }
};

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('cart', {
		id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		userId: {
			type: Sequelize.INTEGER,
			allowNull: false,
			field: 'user_id',  // Fix: Explicitly map to `user_id`
		},
		productId: {
			type: Sequelize.INTEGER,
			allowNull: false,
			field: 'product_id', // Fix: Explicitly map to `product_id`
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
	});
	
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('cart')
  }
};

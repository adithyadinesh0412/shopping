'use strict'
const InventoryModel = require('@database/models/index').Inventory

exports.create = async (data) => {
	try {
		console.log("body : : : : ; ", data)
		return await InventoryModel.create(data)
	} catch (error) {
		console.log(error)
		return error
	}
}

exports.findOne = async (filter, options = {}) => {
	try {
		return await InventoryModel.findOne({
			where: filter,
			...options,
			raw: true,
		})
	} catch (error) {
		return error
	}
}

exports.update = async (filter, update, options = {}) => {
	try {
		return await InventoryModel.update(update, {
			where: filter,
			...options,
			individualHooks: true,
		})
	} catch (error) {
		return error
	}
}


exports.deleteOne = async (id) => {
	try {
		return await InventoryModel.destroy({
			where: {
				id,
			},
			individualHooks: true,
		})
	} catch (error) {
		throw error
	}
}

exports.findAll = async (filter, options = {}) => {
	try {
		return await InventoryModel.findAll({
			where: filter,
			...options,
			raw: true,
		})
	} catch (error) {
		return error
	}
}


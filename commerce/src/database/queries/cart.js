'use strict'
const CartModel = require('@database/models/index').Cart

exports.create = async (data) => {
	try {
		return await CartModel.create(data)
	} catch (error) {
		console.log(error)
		return error
	}
}

exports.findOne = async (filter, options = {}) => {
	try {
		return await CartModel.findOne({
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
		return await CartModel.update(update, {
			where: filter,
			...options,
			individualHooks: true,
		})
	} catch (error) {
		return error
	}
}

exports.findByPk = async (id) => {
	try {
		return await CartModel.findByPk(id, { raw: true })
	} catch (error) {
		return error
	}
}

exports.findAll = async (filter, options = {}) => {
	try {
		return await CartModel.findAll({
			where: filter,
			...options,
			raw: true,
		})
	} catch (error) {
		return error
	}
}


exports.deleteOne = async (id) => {
	try {
		return await CartModel.destroy({
			where: {
				id,
			},
			individualHooks: true,
		})
	} catch (error) {
		throw error
	}
}

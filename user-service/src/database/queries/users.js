'use strict'
const userModel = require('@database/models/index').User

exports.create = async (data) => {
	try {
		console.log('REACHED CREATE FUNCTION')
		return await userModel.create(data)
	} catch (error) {
		console.log(error)
		return error
	}
}

exports.findOne = async (filter, options = {}) => {
	try {
		return await userModel.findOne({
			where: filter,
			...options,
			raw: true,
		})
	} catch (error) {
		return error
	}
}

exports.updateUser = async (filter, update, options = {}) => {
	try {
		return await userModel.update(update, {
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
		return await userModel.findByPk(id, { raw: true })
	} catch (error) {
		return error
	}
}

exports.findAll = async (filter, options = {}) => {
	try {
		return await userModel.findAll({
			where: filter,
			...options,
			raw: true,
		})
	} catch (error) {
		return error
	}
}


const bcryptJs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const md5 = require('md5')

const algorithm = 'aes-256-cbc'

const generateToken = (tokenData, secretKey, expiresIn) => {
	return jwt.sign(tokenData, secretKey, { expiresIn })
}

const hashPassword = (password) => {
	const salt = bcryptJs.genSaltSync(10)
	let hashPassword = bcryptJs.hashSync(password, salt)
	return hashPassword
}

const comparePassword = (password1, password2) => {
	return bcryptJs.compareSync(password1, password2)
}

/**
 * md5 hash
 * @function
 * @name md5Hash
 * @returns {String} returns uuid.
 */

function md5Hash(value) {
	return md5(value)
}

function isNumeric(value) {
	return /^\d+$/.test(value)
}

function extractFilename(fileString) {
	const match = fileString.match(/([^/]+)(?=\.\w+$)/)
	return match ? match[0] : null
}

function extractDomainFromEmail(email) {
	return email.substring(email.lastIndexOf('@') + 1)
}

function isValidEmail(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	return emailRegex.test(email)
}

function isValidName(name) {
	const nameRegex = /^[A-Za-z\s'-]+$/
	return nameRegex.test(name)
}
const generateWhereClause = (tableName) => {
	let whereClause = ''

	switch (tableName) {
		case 'users':
			whereClause = `deleted_at IS NULL AND status = 'ACTIVE'`
			break

		default:
			whereClause = 'deleted_at IS NULL'
	}

	return whereClause
}

const getRoleTitlesFromId = (roleIds = [], roleList = []) => {
	return roleIds.map((roleId) => {
		const role = roleList.find((r) => r.id === roleId)
		return role ? role.title : null
	})
}

const convertDurationToSeconds = (duration) => {
	const timeUnits = {
		s: 1,
		m: 60,
		h: 3600,
		d: 86400,
	}

	const match = /^(\d*\.?\d*)([smhd])$/.exec(duration)
	if (!match) {
		throw new Error('Invalid duration format')
	}

	const value = parseFloat(match[1])
	const unit = match[2]

	if (!(unit in timeUnits)) {
		throw new Error('Invalid duration unit')
	}

	return value * timeUnits[unit]
}


function convertExpiryTimeToSeconds(expiryTime) {
	expiryTime = String(expiryTime)
	const match = expiryTime.match(/^(\d+)([m]?)$/)
	if (match) {
		const value = parseInt(match[1], 10) // Numeric value
		const unit = match[2]
		if (unit === 'm') {
			return Math.floor(value / 60)
		} else {
			return value
		}
	}
}

module.exports = {
	generateToken,
	hashPassword,
	comparePassword,
	md5Hash,
	isNumeric: isNumeric,
	extractFilename: extractFilename,
	extractDomainFromEmail: extractDomainFromEmail,
	isValidEmail,
	isValidName,
	generateWhereClause,
	getRoleTitlesFromId,
	convertDurationToSeconds,
	convertExpiryTimeToSeconds,
}

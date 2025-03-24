const responses = require('@helpers/responses')
const httpStatusCode = require('@generics/http-status')
const jwt = require('jsonwebtoken')
module.exports =  async function (req, res, next) {
    const unAuthorizedResponse = responses.failureResponse({
		message: 'UNAUTHORIZED_REQUEST',
		statusCode: httpStatusCode.unauthorized,
		responseCode: 'UNAUTHORIZED',
	})
	try{
		const authHeader = req.get('X-auth-token')
	let token
	const [authType, extractedToken] = authHeader.split(' ')
	if (authType.toLowerCase() !== 'bearer') throw unAuthorizedResponse
	token = authType.toLowerCase() === 'bearer' ? extractedToken?.trim() : authType.trim()
	try {
		decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
	} catch (err) {
		console.log("ERRRRRR : ",err)
		if (err.name === 'TokenExpiredError') {
			throw responses.failureResponse({
				message: 'ACCESS_TOKEN_EXPIRED',
				statusCode: httpStatusCode.unauthorized,
				responseCode: 'UNAUTHORIZED',
			})
		} else throw unAuthorizedResponse
	}

	if (!decodedToken) throw unAuthorizedResponse
	req.userId = decodedToken.data.id
    return next()
	} catch (err) {
		console.log(err)
		next(err)
	}
}


const responses = require('@helpers/responses')
const httpStatusCode = require('@generics/http-status')
module.exports =  async function (req, res, next) {
    const unAuthorizedResponse = responses.failureResponse({
		message: 'UNAUTHORIZED_REQUEST',
		statusCode: httpStatusCode.unauthorized,
		responseCode: 'UNAUTHORIZED',
	})
	
    next()
}


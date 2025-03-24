const successResponse = async ({ statusCode = 500, responseCode = 'OK', message, result = [], meta = {} }) => {
	let response = {
		statusCode,
		responseCode,
		message,
		result
	}
	return response
}

const failureResponse = ({ message = 'Oops! Something Went Wrong.', statusCode = 500, responseCode, result }) => {
	const error = new Error(message)
	error.statusCode = statusCode
	error.responseCode = responseCode
	error.message = message
	error.data = result || []

	return error
}

module.exports = {
	successResponse,
	failureResponse,
}

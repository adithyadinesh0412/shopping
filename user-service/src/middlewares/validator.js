module.exports = (req, res, next) => {
	try {
		const version = (req.params.version.match(/^v\d+$/) || [])[0] // Match version like v1, v2, etc.
		const controllerName = (req.params.controller.match(/^[a-zA-Z0-9_-]+$/) || [])[0] // Allow only alphanumeric characters, underscore, and hyphen
		const method = (req.params.method.match(/^[a-zA-Z0-9]+$/) || [])[0] // Allow only alphanumeric characters
		require(`@validators/${version}/${controllerName}`)[method](req)
		console.log("OOOOOOOOO")
	} catch {}
	next()
}

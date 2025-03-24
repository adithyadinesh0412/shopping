require('module-alias/register')
const express = require('express')
require('dotenv').config({ path: './.env' })
const i18next = require('i18next')
const Backend = require('i18next-fs-backend')
const middleware = require('i18next-http-middleware')
const bodyParser = require('body-parser')
const cors = require('cors')
// i18next
// 	.use(Backend)
// 	.use(middleware.LanguageDetector)
// 	.init({
// 		fallbackLng: 'en',
// 		lng: 'en',
// 		ns: ['translation'],
// 		defaultNS: 'translation',
// 		backend: {
// 			loadPath: './locales/{{lng}}.json',
// 		},
// 		detection: {
// 			lookupHeader: 'accept-language',
// 		},
// 	})



const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true, limit: '50MB' }))
app.use(bodyParser.json({ limit: '50MB' }))
require('./routes')(app)

// app.use(middleware.handle(i18next))
// Server listens to given port
app.listen(process.env.APPLICATION_PORT, (res, err) => {
	if (err) {
		onError(err)
	}
	console.log('Environment: ' + process.env.APPLICATION_ENV)
	console.log('Application is running on the port:' + process.env.APPLICATION_PORT)
})
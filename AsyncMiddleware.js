const errorHandler = require('./ErrorHandler')

const asyncMiddleware = fn => (req, res, next) => {
	Promise.resolve(fn(req, res, next))
		.catch(err => errorHandler(err, res))
}

module.exports = asyncMiddleware
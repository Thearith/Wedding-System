const errorHandler = (err, res) => {
	const httpCode = err.httpCode || 500
	const message = err.message || "There is something wrong with our server. Please try again later."
	console.log(err)
	res.status(httpCode).json({message: message})
}

module.exports = errorHandler
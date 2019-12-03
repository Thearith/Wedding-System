const { Pool } = require('pg')
const dotenv = require('dotenv')

dotenv.config()

function newPool() {
	const pool = new Pool({
		user: process.env.DB_USER,
		host: process.env.DB_HOST,
		database: process.env.DB_NAME,
		password: process.env.DB_PASSWORD,
		port: parseInt(process.env.DB_SERVER_PORT)
	})
	
	pool.on('connect', () => {
		console.log('database server has been connected')
	})
	
	pool.on('remove', () => {
		console.log('client removed')
	})

	return pool
}

module.exports = {
	newPool
}
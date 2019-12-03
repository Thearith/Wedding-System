const { newPool } = require('./Connect')

const commands = {
	createTable: `
		CREATE TABLE IF NOT EXISTS users(
			id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
			name VARCHAR(36) NOT NULL,
			"emailAddress" VARCHAR(50) NOT NULL UNIQUE,
			password VARCHAR(50) NOT NULL
		);
	`,

	insertRow: `
		INSERT INTO users(name, "emailAddress", password)
		VALUES($1, $2, $3)
		RETURNING *
		;
	`,

	dropTable: `DROP TABLE IF EXISTS users;`
}

async function createUser(
	name,
	emailAddress,
	password
) {
	const values = [name, emailAddress, password]
	const result = await newPool().query(commands.insertRow, values)
	return result.rows[0]
}

async function getUser(emailAddress, password) {
	const command = `SELECT * FROM users WHERE "emailAddress" = $1 AND "password" = $2`
	const result = await newPool().query(command, [emailAddress, password])
	return result.rows[0]
}

module.exports = {
	commands,
	createUser,
	getUser
}
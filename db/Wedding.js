const { newPool } = require('./Connect')

const commands = {
	createTable: `
		CREATE TABLE IF NOT EXISTS weddings(
			id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
			"userId" VARCHAR(36) NOT NULL,
			"brideName" VARCHAR(50) NOT NULL,
			"groomName" VARCHAR(50) NOT NULL,
			date VARCHAR(50) NOT NULL,
			location VARCHAR(300),
			guests JSONB [] NOT NULL DEFAULT '{}'
		);
	`,

	insertRow: `
		INSERT INTO weddings("userId", "brideName", "groomName", date, location, guests)
		VALUES($1, $2, $3, $4, $5, $6)
		RETURNING *
		;
	`,

	dropTable: `DROP TABLE IF EXISTS weddings;`
}

async function getWeddings(userId) {
	const command = `SELECT 
			id, "userId", "brideName", "groomName", date, location
		FROM weddings where "userId" = $1
	`
	const result = await newPool().query(command, [userId])
	return result.rows
}

async function updateGuests(weddingId, guests) {
	const command = `UPDATE weddings SET guests = $1 WHERE id = $2
		RETURNING *
	`
	const result = await newPool().query(command, [guests, weddingId])
	return result.rows[0]
}

async function createWedding(
	userId,
	brideName,
	groomName,
	date,
	location,
	guests
) {
	const values = [userId, brideName, groomName, date, location, guests]
	const result = await newPool().query(commands.insertRow, values)
	return result.rows[0]
}

async function getWeddingInfo(weddingId) {
	const command = `SELECT 
			id, "userId", "brideName", "groomName", date, location
		FROM weddings where id = $1
	`
	const result = await newPool().query(command, [weddingId])
	return result.rows[0]
}

async function getWeddingGuests(weddingId) {
	const command = `SELECT guests FROM weddings where id = $1`
	const result = await newPool().query(command, [weddingId])
	return result.rows[0].guests
}

module.exports = {
	commands,
	createWedding,
	getWeddingInfo,
	getWeddingGuests,
	updateGuests,
	getWeddings
}
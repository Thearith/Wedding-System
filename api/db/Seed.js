const { newPool } = require('./Connect')
const userDB = require('./User')
const weddingDB = require('./Wedding')

const installPackages = `
	CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
`
const createTables = () => {
	const commands = [
		installPackages,
		userDB.commands.createTable, 
		weddingDB.commands.createTable
	]
	executeSqlCommands(commands)
}

const dropTables = () => {
	const commands = [
		userDB.commands.dropTable,
		weddingDB.commands.dropTable
	]
	executeSqlCommands(commands)
}

async function executeSqlCommands(commands) {
	const pool = newPool()
	const client = await pool.connect()
	try {
		for(i = 0; i<commands.length; i++) {
			const res =  await client.query(commands[i])
			console.log(res)
		}
		client.release()
	} catch (err) {
		client.release()
		console.log(err)
	}
}

module.exports = { 
	createTables,
	dropTables
}

require('make-runnable')
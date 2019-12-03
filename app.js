const express = require('express')

const api = require('./api/app')
const web = require('./web/app')

const app = express()

app.use("/api", api)
app.use("/", web)

const port = process.env.PORT || 3000
app.listen(port, () => {
	console.log("App is listening to port " + port)
})
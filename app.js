const express = require('express')
const bodyParser = require('body-parser')

const asyncWrap = require('./AsyncMiddleware')
const userDb = require('./db/User')
const weddingDb = require('./db/Wedding')

const app = express()
app.use(bodyParser.json())

app.post("/login", asyncWrap(async (req, res) => {
	const email = req.body.email
	const password = req.body.password
	const user = await userDb.getUser(email, password)
	if (user == null) {
		throw {
			code: 401,
			message: 'Unauthorized'
		}
	}

	res.sendStatus(200)
}))

app.post("/signUp", asyncWrap(async (req, res) => {
	const name = req.body.name
	const email = req.body.email
	const password = req.body.password
	console.log(name + email)
	await userDb.createUser(name, email, password)
	res.sendStatus(200)
}))

app.use("/", asyncWrap(async (req, res, next) => {
	const email = req.headers.email
	const password = req.headers.password
	const user = await userDb.getUser(email, password)
	if (user == null) {
		throw {
			code: 401,
			message: 'Unauthorized'
		}
	}

	req.body.userId = user.id
	next()
}))

app.get("/weddings", asyncWrap(async (req, res) => {
	const userId = req.body.userId
	const weddings = await weddingDb.getWeddings(userId)
	res.status(200).json(weddings)
}))

app.get("/weddings/:weddingId", asyncWrap(async (req, res) => {
	const q = req.query.q
	const weddingId = req.params.weddingId

	if (q == "guests") {
		const guests = await weddingDb.getWeddingGuests(weddingId)
		res.status(200).json({ 
			guests: guests
		})
		
	} else if (q == "amount") {
		const allGuests = await weddingDb.getWeddingGuests(weddingId) || []	
		const gifts = getWeddingGifts(allGuests)
		res.status(200).json(gifts)

	} else {
		const weddingInfo = await weddingDb.getWeddingInfo(weddingId)
		res.status(200).json(weddingInfo)
	}
}))

app.post("/weddings", asyncWrap(async (req, res) => {
	const userId = req.body.userId
	const brideName = req.body.brideName
	const groomName = req.body.groomName
	const date = req.body.date
	const location = req.body.location
	const guests = req.body.guests || []
	const wedding = await weddingDb.createWedding(userId, brideName, groomName, date, location, guests)
	res.status(200).json(wedding)
}))

app.post("/weddings/:weddingId", asyncWrap(async (req, res) => {
	const weddingId = req.params.weddingId
	const q = req.query.q

	if (q == "guest") {
		const guestName = req.body.name
		const rielAmount = req.body.rielAmount
		const dollarAmount = req.body.dollarAmount

		const guestInfo = {
			name: guestName,
			rielAmount, 
			dollarAmount
		}

		const guests = await weddingDb.getWeddingGuests(weddingId)
		for (i = 0; i < guests.length; i++) {
			if (guests[i].name == guestName) {
				guests[i] = guestInfo
				break
			}
		}
		
		const wedding = await weddingDb.updateGuests(weddingId, guests)
		res.status(200).json(wedding)
	} else {
		const guestNames = req.body.guests || []
		const guests = []
		for(i = 0; i<guestNames.length; i++) {
			guests[i] = {
				name: guestNames[i]
			}
		}

		const wedding = await weddingDb.updateGuests(weddingId, guests)
		res.status(200).json(wedding)
	}
}))

function getWeddingGifts(weddingGuests) {
	var amountInDollar = 0
	var amountInRiel = 0

	for (i = 0; i < weddingGuests.length; i++) {
		const guest = weddingGuests[i]
		amountInDollar += guest.dollarAmount || 0
		amountInRiel += guest.rielAmount || 0
	}

	return  {
		amountInDollar,
		amountInRiel
	}
}

const port = process.env.PORT || 3000
app.listen(port, () => {
	console.log("Listening to port " + port)
})
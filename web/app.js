const express = require('express')
const path = require('path')

const router = express.Router()

router.use(express.static(path.join(__dirname, 'public')))

router.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, 'public/html/index.html'))
})

router.get("/auth", (req, res) => {
	res.sendFile(path.join(__dirname, 'public/html/login.html'))
})

router.get("/weddings/:weddingId", (req, res) => {
	res.sendFile(path.join(__dirname, 'public/html/wedding.html'))
})

module.exports = router
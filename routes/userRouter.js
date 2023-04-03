const express = require('express')
const router = express.Router()
const { signup, login } = require('../controllers/user')

const { authenticateUser } = require('../middleware/authentications')

router.post('/signUp', signup)
router.post('/login', login)


module.exports = router
const express = require('express')
const router = express.Router()
const { transaction } = require('../controllers/transactions')

const { authenticateUser } = require('../middleware/authentications')

router.patch('/transaction', authenticateUser, transaction)


module.exports = router
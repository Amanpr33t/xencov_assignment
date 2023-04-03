const User = require('../models/user')
const jwt = require('jsonwebtoken')
require('dotenv').config()

//authentication with headers
const authenticateUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(400).json({ status: 'failed', msg: 'authentication failed' })
        }
        const token = authHeader.split(' ')[1]

        const payload = jwt.verify(token, process.env.JWT_SECRET)

        if (!payload) {
            res.status(400).json({ status: 'failed', msg: 'authentication failed' })
        }
        const user = await User.findOne({ _id: payload.userId })
        if (!user) {
            res.status(400).json({ status: 'failed', msg: 'authentication failed' })
        }
        req.userId = payload.userId
        next()
    } catch (error) {
        console.log(error)
    }
}


module.exports = {
    authenticateUser
}
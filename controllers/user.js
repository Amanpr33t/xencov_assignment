
const User = require('../models/user')
//const Note= require('../models/note')
//const Token= require('../models/Token')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const origin = process.env.ORIGIN

const signup = async (req, res) => {
    /*runningBalance: {
    wallet: { type: Number, required: true }, // CURRENT FUNDS STORED
    gold: { type: Number, required: true }, // CURRENT GOLD QTY IN GMS
    goldPrice: { type: Number, required: true }, // CURRENT GOLD PRICE*/

    try {
        const { firstName, lastName, password, mobileNumber, country, email, goldPrice } = req.body
        if (!email || !firstName || !password || !lastName || !password || !mobileNumber || !country || !goldPrice) {
            return res.status(400).json({ status: 'failed', msg: 'enter all credentials' })
        }
        const emailCheck = await User.findOne({ email })
        if (emailCheck) {
            return res.status(400).json({ status: 'failed', msg: 'email already exists' })
        }
        const mobileCheck = await User.findOne({ mobileNumber })
        if (emailCheck) {
            return res.status(400).json({ status: 'failed', msg: 'mobile number already exists' })
        }
        const runningBalance = {
            wallet: 100000,
            gold: 1000,
            goldPrice: req.body.goldPrice
        }
        const user = await User.create({ firstName, lastName, password, mobileNumber, country, email, runningBalance, initialAmount: runningBalance.wallet })

        const authToken = user.createJWT()
        return res.status(200).json({ status: 'ok', authToken })


    } catch (error) {
        console.log(error)
    }

}


const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ status: 'failed', msg: 'enter all credentials' })

        }
        //const user= await User.findOne({email}).populate('notes')
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ status: 'failed', msg: 'invalid user' })
        }

        const isPasswordCorrect = await user.comparePassword(password)

        if (!isPasswordCorrect) {
            return res.status(400).json({ status: 'failed' })
        }
        const authToken = user.createJWT()
        return res.status(200).json({ status: 'ok', authToken })
    } catch (error) {
        console.log(error)
    }

}

module.exports = {
    signup,
    login
}

const Transaction = require('../models/transactions')
const User = require('../models/user')
const Wallet = require('../models/wallet')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const origin = process.env.ORIGIN

const transaction = async (req, res) => {
    try {
        const { quantity, amount, type, priceOfGold } = req.body
        const userId = req.userId
        const user = await User.findOne({
            _id: userId
        })
        const { wallet, gold } = user.runningBalance
        if (type === 'CREDIT') {
            if (quantity > gold) {
                const transaction = await Transaction.create({
                    userId, amount, quantity, type: 'CREDIT', status: 'CANCELED', runningBalance: { wallet, loyaltyPoints: 0, goldBalances: gold }
                })
                await Wallet.create({
                    userId, quantity, amount, type: 'CREDIT', status: 'FAILED', runningBalance: wallet, transaction: transaction._id
                })
                return res.status(400).json({ status: "CANCELED" })
            } else {
                await User.findOneAndUpdate(
                    { _id: userId },
                    {
                        runningBalance: {
                            wallet: wallet + amount,
                            gold: gold - quantity,
                            goldPrice: priceOfGold
                        }
                    },
                    { new: true, runValidators: true })
                const transaction = await Transaction.create({
                    userId, quantity, amount, type: 'CREDIT', status: 'SUCCESS', runningBalance: { wallet: wallet + amount, loyaltyPoints: 10, goldBalances: gold - quantity }
                })
                await Wallet.create({
                    userId, quantity, amount, type: 'CREDIT', status: 'SUCCESS', runningBalance: wallet + amount, transaction: transaction._id
                })
                return res.status(200).json({
                    status: "success", data: {
                        netFundAdded: amount,
                        currentFund: wallet + amount,
                        netGrowthOrLoss: wallet + amount - user.initialAmount,
                        gainOrLossPercentage: ((wallet + amount - user.initialAmount) / user.initialAmount) * 100
                    }
                })
            }
        } else {
            if (amount > wallet) {
                const transaction = await Transaction.create({
                    userId, quantity, amount, type: 'DEBIT', status: 'CANCELED', runningBalance: { wallet, loyaltyPoints: 0, goldBalances: gold }
                })
                await Wallet.create({
                    userId, quantity, amount, type: 'DEBIT', status: 'FAILED', runningBalance: wallet, transaction: transaction._id
                })
                res.status(400).json({ status: "CANCELED" })
            } else {
                await User.findOneAndUpdate(
                    { _id: userId },
                    {
                        runningBalance: {
                            wallet: wallet - amount,
                            gold: gold + quantity,
                            goldPrice: priceOfGold
                        }
                    },
                    { new: true, runValidators: true })
                const transaction = await Transaction.create({
                    userId, quantity, amount, type: 'DEBIT', status: 'SUCCESS', runningBalance: { wallet: wallet - amount, loyaltyPoints: 10, goldBalances: gold + quantity }
                })
                await Wallet.create({
                    userId, quantity, amount, type: 'DEBIT', status: 'SUCCESS', runningBalance: wallet - amount, transaction: transaction._id
                })
                return res.status(200).json({
                    status: "success", data: {
                        netFundAdded: amount,
                        currentFund: wallet - amount,
                        netGrowthOrLoss: wallet - amount - user.initialAmount,
                        gainOrLossPercentage: ((wallet - amount - user.initialAmount) / user.initialAmount) * 100
                    }
                })
            }
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    transaction
}
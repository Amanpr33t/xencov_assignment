const mongoose = require('mongoose')
const WallletSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    }, // To store the user id
    amount: {
        type: Number,
        required: true
    }, // Amount of the transaction done.
    type: {
        type: String,
        required: true,
        enums: ['CREDIT', 'DEBIT']
    }, // Type - debit or credit.
    status: {
        type: String,
        required: true,
        enums: ['FAILED', 'SUCCESS', 'PROCESSING'],
    }, // Status of the transaction being done.
    runningBalance: {
        type: Number, 
        required: true
    }, // Running Balance of the user after each transaction.
    transaction: {
        type: mongoose.Types.ObjectId,
        ref: 'Transaction'
    }, // Gold transactions reference.
}, { timestamps: true })
module.exports = mongoose.model('Walllet', WallletSchema)
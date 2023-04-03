

const mongoose = require('mongoose')
const TransactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    }, // To store the user id
    amount: {
        type: Number,
        required: true
    }, // Amount spent or earned
    quantity: {
        type: Number,
        required: true
    },//quantity of gold in gms.
    type: {
        type: String,
        required: true,
        enums: ['CREDIT', 'DEBIT']
    }, // Type - debit or credit.
    status: {
        type: String,
        required: true,
        enums: ["FAILED", "SUCCESS", 'WAITING', 'CANCELED', 'PENDING']
    }, // Status of the transaction being done.
    runningBalance: {
        wallet: {
            type: Number,
            required: true
        }, // CURRENT FUNDS STORED
        loyaltyPoints: {
            type: Number,
            required: true
        },
        goldBalances: {
            type: Number,
            required: true
        }
    }
}, { timestamps: true })
module.exports = mongoose.model('Transaction', TransactionSchema)
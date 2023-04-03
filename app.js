const express = require('express')
const app = express()
const userRouter = require('./routes/userRouter')
const transactionRouter = require('./routes/transactionRouter')
const connectDB = require('./db/connect')
require('dotenv').config()
const port = process.env.PORT || 5101
const mongoose = require('mongoose')
mongoose.set('strictQuery', true)
const notFound = require('./middleware/notFound')
const { authenticateUser } = require('./middleware/authentications')
const cors = require('cors')
app.use(cors())
app.use(express.static('./public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/user', userRouter)
app.use('/gold', transactionRouter)
app.use(notFound)
app.use((req, res) => res.status(400).json({ status: 'failed', msg: 'some error occured' }))

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`server running on port ${port}...`))
    } catch (error) {
        console.log(error)
    }
}
start()



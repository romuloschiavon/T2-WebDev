const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config({path: './src/database/.env'})

mongoose.set('strictQuery', false)

mongoose.connect(process.env.CONNECTION_PASSWORD, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.Promise = global.Promise;

module.exports = mongoose;
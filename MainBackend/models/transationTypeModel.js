const mongoose  = require('mongoose')

const Schema = mongoose.Schema

const transationtypeSchema = new Schema({
    transactionType:{
        type:String,
        unique:true
    },
})

module.exports = mongoose.model('transationtypemodel',transationtypeSchema)
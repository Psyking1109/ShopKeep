const mongoose  = require('mongoose')

const Schema = mongoose.Schema

const transationtypeSchema = new Schema({
    transactionAccountName:{
        type:String,
        unique:true
    },
    details:[{
        transactionHistory:{
            type:mongoose.Schema.Types.ObjectId
        }
    }]

})

module.exports = mongoose.model('transationtypemodel',transationtypeSchema)
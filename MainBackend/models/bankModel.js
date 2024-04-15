const mongoose = require('mongoose')

const Schema = mongoose.Schema


const bankSchema = new Schema({
    bankName:{
        type:String,
        required:true
    },
    accountName:{
        type:String,
        required:true
    },
    accountNumber:{
        type:String,
        required:true,
        unique:true
    },
    bankAccountId:{
        type:String,
        required:true,
        unique:true
    },
    transactions:[{
        reference:{
            type:mongoose.Schema.Types.ObjectId,//this could be a invoice or any other transactions
            required:true
        },
        deposit:{
            type:Number
        },
        widrawal:{
            type:Number
        },
        transactionsType:{
            type:mongoose.Schema.Types.ObjectId,
            required:true
        }
    }]
})

module.exports = mongoose.model('bankModel',bankSchema)
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const LedgerAccountSchema = new Schema({
    accountName:{
        type:String,
        required:true,
        unique:true
    },
    transactionType:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'transationtypemodel'
    },
    transactions:[{
        transactiondetails:{
            type:mongoose.Schema.Types.ObjectId,
            required:true
        }
    }]
})


module.exports = mongoose.model('ledgerAccountModel',LedgerAccountSchema)
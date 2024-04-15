const mongoose = require('mongoose')

const Schema = mongoose.Schema


const cashSchema = new Schema({

    cashName:{
        type:String,
        required:true
    },
    cashId:{
        type:String,
        required:true,
        unique:true
    },
    transactions:[{
        reference:{
            type:mongoose.Schema.Types.ObjectId, //this could be a invoice or any other transactions
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

module.exports = mongoose.model('cashModel',cashSchema)
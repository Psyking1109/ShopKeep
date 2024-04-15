const mongoose = require('mongoose')

const Schema = mongoose.Schema


const chequeSchema = new Schema({

    chequeAccountName:{
        type:String,
        required:true
    },
    chequeAccountId:{
        type:String,
        required:true,
        unique:true
    },
    transactions:[{
        reference:{
            type:mongoose.Schema.Types.ObjectId, //this could be a invoice or any other transactions
            required:true
        },
        chequeNumber:{
            type:Number,
            required:true
        },
        bankName: {
            type: String,
            required:true
        },
        bankBranch: {
            type: String,
            required:true
        },
        datedTo: {
            type: Date,
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

module.exports = mongoose.model('chequeModel',chequeSchema)
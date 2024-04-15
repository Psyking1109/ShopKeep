const mongoose = require("mongoose")


const Schema = mongoose.Schema

const paymentSchema = new Schema({

    customerName: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    ivoiceNumber: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    paymentDetails: [{
        paymentType: {
            type: String,
            enum: ['cash', 'cheque', 'bank','Full_credit'],
            default: 'cash',
            required: true
        },
        transaction:{
            type: mongoose.Schema.Types.ObjectId
        }
        /*
        bankDetails: [{
            bankName: {
                type: String
            },
            accountName:{
                type: String,
            },
            accountID:{
                type: String
            },
            accountNumber: {
                type: String
            },
            depositDate: {
                type: Date
            },
            amount:{
                type:Number
            }
        }],
        chequeDetails: [{
            chequeNumber:{
                type:Number
            },
            bankName: {
                type: String
            },
            bankBranch: {
                type: String
            },
            datedTo: {
                type: Date
            },
            amount:{
                type:Number
            }
        }],
        cashDetails:[{
            cashType:{
                type:String
            },
            date:{
                type:Date,
            },
            amount:{
                type:Number
            }
        }]     
        */
    }],
    paidAmount: {
        type: Number,
        required: true
    },


})

module.exports = mongoose.model('paymentModel',paymentSchema)
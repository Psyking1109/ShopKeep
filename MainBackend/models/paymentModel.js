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
    hasBalance: {
        type: Boolean,
        required: true
    },
    paymentDetails: [{
        paymentType: {
            type: String,
            enum: ['cash', 'cheque', 'bank','Full_credit'],
            default: 'cash',
            required: true
        },
        bankDetails: [{
            bankName: {
                type: String
            },
            bankID: {
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
            date:{
                type:Date,
            },
            amount:{
                type:Number
            }
        }]     
    }],
    paidAmount: {
        type: Number,
        required: true
    },
    balance:{
        type:Number,
        required:true
    }

})

module.exports = mongoose.model('paymentModel',paymentSchema)
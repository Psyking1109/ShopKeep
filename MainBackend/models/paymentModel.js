const mongoose = require("mongoose")


const Schema = mongoose.Schema

const paymentSchema = new Schema({

    customerName: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    ivoiceNumber: {
        type: String,
        required: true
    },
    hasBalance: {
        type: Boolean,
        required: true
    },
    hasDebit:{
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
                type: string
            },
            depositDate: {
                type: Date
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
            }
        }],
        paidAmount: {
            type: Number,
            required: true
        },
        balance:{
            type:Number,
            required:true
        }
        

    }]


})

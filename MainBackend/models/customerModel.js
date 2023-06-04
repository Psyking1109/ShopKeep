const mongoose = require("mongoose")


const Schema = mongoose.Schema

const customerSchema = new Schema({
    customer_Name:{
        type:String
    },
    customerPayment:[{
        invoiceNumber:{
            type:String,
            required:true
        },
        billDate:{
            type:Date,
            required:true
        },
        balanceAmount:{
            type:Number,
            required:true
        },
        DebitAmount:{
            type:Number,
            required:true
        },
        paymentType:{
            type:String,
            required:true
        }
    }]
  
})

module.exports = mongoose.model('Customers',customerSchema)
const mongoose = require("mongoose")


const Schema = mongoose.Schema

const customerSchema = new Schema({
    customer_Name:{
        type:String
    },
    customerPayment:[{
        invoiceNumber:{
            type:mongoose.Schema.Types.ObjectId,
            required:true
        },
        paymentDetails:{
            type:mongoose.Schema.Types.ObjectId,
            required:true
        }

    }]
  
})

module.exports = mongoose.model('Customers',customerSchema)
const mongoose = require("mongoose")


const Schema = mongoose.Schema

const customerSchema = new Schema({
    customer_Name:{
        type:String
    },
    customerInvoice:[{      
            type:mongoose.Schema.Types.ObjectId,
            ref:'Invoice'
    }]
  
})

module.exports = mongoose.model('Customers',customerSchema)
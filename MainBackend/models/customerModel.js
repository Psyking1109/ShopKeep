const mongoose = require("mongoose")


const Schema = mongoose.Schema

const customerSchema = new Schema({
    customer_Name:{
        type:String
    },
    customer_Bills:{
        type:String
    }
})

module.exports = mongoose.model('Customers',customerSchema)
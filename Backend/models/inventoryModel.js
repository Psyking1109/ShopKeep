const mongoose = require("mongoose")

const Schema = mongoose.Schema

const inventorySchema = new Schema({
    product_Name:{
        type:String,
        required:true
    },
    product_code:{
        type:String,
        required:true,
        unique: true
    },
    product_Price:{
        type:Number,
        required:true
    },
    product_PerUnit:{
        type:Number,
        required:true
    },
    product_Instock:{
        type:Number
    }
})

module.exports = mongoose.model('Inventory',inventorySchema)
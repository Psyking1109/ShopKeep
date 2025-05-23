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
    product_loosePrice:{
        type:Number
    },
    product_PerUnit:{
        type:Number,
        required:true
    },
    product_Instock:{
        type:Number
    },
    products_movement:[{
        date:{
            type:Date
        },
        bill_number:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Invoice"
        },
        sold:{
            type:Number
        },
        recived:{
            type:Number
        }
        
    }]
})

module.exports = mongoose.model('Inventory',inventorySchema)
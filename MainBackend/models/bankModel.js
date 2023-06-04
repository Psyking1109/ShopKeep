const mongoose = require("mongoose")


const Schema = mongoose.Schema

const bankSchema = new Schema({
    bankName:{
        type:String,
        require:true
    },
    bankId:{
        type:String,
        required:true
    },
 
    bankEntries:[
        {
        billDetails:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'Invoice',
            required: true
        },
        transactionDate:{
            type:Date,
            required:true
            
        },
        transferAmount:{
            type:Number,
            required:true
        }
    }
    ]   
})

module.exports = mongoose.model('Bank',bankSchema)
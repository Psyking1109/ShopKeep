const mongoose = require("mongoose")


const Schema = mongoose.Schema

const chequeSchema = new Schema({

        customerName:{
            type: mongoose.Schema.Types.ObjectId,
            require:true
            },
        ivoiceNumber:{
                type:String,
                required:true
            },
        chequeNumber:{
            type:String,
            required:true
        },
        chequeDate:{
            type:Date,
            required:true
            
        },
        chequeAmount:{
            type:Number,
            required:true
        }
    
      
})

module.exports = mongoose.model('Cheque',chequeSchema)
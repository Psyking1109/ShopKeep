const mongoose = require('mongoose')

const Schema = mongoose.Schema
const userSchema = new Schema({
    userName:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['admin','sales','stock','accounts'],
        default:'stock'
    }
})

module.exports = mongoose.model('User',userSchema)
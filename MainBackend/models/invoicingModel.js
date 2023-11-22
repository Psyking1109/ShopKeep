const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique:true
  },
  date: {
    type: Date,
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inventory',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      price: {
        type: Number,
        required: true
      }
    }
  ],
billType:{
    type:String,
    enum:['Tax','Ml_Bill'],
    default:'Ml_Bill'
},
paymentDetails:{
        type:mongoose.Schema.Types.ObjectId,
     // required:true
},
  subtotal: {
    type: Number,
   // required: true
  },
  total: {
    type: Number,
   // required: true
  }
});

module.exports = mongoose.model('Invoice', invoiceSchema);
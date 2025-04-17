const mongoose = require('mongoose');

const TaxSchema = new mongoose.Schema({
  Taxname: {
    type: String,
    required: true,
    unique: true,
  },
  rate: {
    type: Number,
    required: true, 
  },
  taxPriority:{
    type:Number,
    require:true
  },
  deductable: [
    {
        taxType:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tax',
        },
        deductablePriority:{
            type:Number,
            unique: true
        }
  }],
});

module.exports = mongoose.model('Tax', TaxSchema);

const transationTypeModel = require("../models/transationTypeModel")

const createTransactionType =  async(req,res)=>{
    const transactionType = req.body.transactionType

    let emptyFields = []
    if(!transactionType){
        emptyFields.push('transactionType')
    }
    if(emptyFields.length > 0){
        return res.status(400).json({error: 'Please fill in all the fields ', emptyFields})
    }

    try{
        const createTransactionType = await transationTypeModel.create({
            transactionType
        })
        res.status(200).json(createTransactionType)
    }catch(error){
        res.status(400).json({error:error.message})
    }
    
}



module.exports={
    createTransactionType
}
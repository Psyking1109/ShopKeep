const mongoose = require('mongoose')
const Inventory = require('../models/inventoryModel')

//Get All Inventory
const getallProducts = async(req,res)=>{
    const products = await Inventory.find()
    res.status(200).json(products)
}

//Get Single product
const getSingleproduct = async(req,res)=>{
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error:'No such Product Found'})
    }
    const products = await Inventory.findById(id)
    if(!products){
        return res.status(404).json({error:'No such Product Found'})
    }
    res.status(200).json(products)
}

//Create New Product
const createProducts = async(req,res)=>{
const{product_Name,
    product_code,
    product_Price,
    product_loosePrice,
    product_PerUnit,
    product_Instock
}=req.body
let emptyFields = []
if(!product_Name){
    emptyFields.push('product_name')
}
if(!product_code){
    emptyFields.push('product_code')
}
if(!product_Price){
    emptyFields.push('product_Price')
}
if(!product_loosePrice){
    emptyFields.push('product_loosePrice')
}
if(!product_PerUnit){
    emptyFields.push('product_PerUnit')
}
if(!product_Instock){
    emptyFields.push('product_Instock')
}
if(emptyFields.length > 0){
    return res.status(400).json({error: 'Please fill in all the fields ', emptyFields})
}
try{
    const products = await Inventory.create({
        product_Name,
        product_code,
        product_Price,
        product_loosePrice,
        product_PerUnit,
        product_Instock
    })
    res.status(200).json(products)
}catch(error){
    res.status(400).json({error:error.message})
}
}


//Delete Products
const deleteProduct = async(req,res)=>{
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error:"No Such Product"})
    }
    const products = await Inventory.findOneAndDelete({_id:id})
    if(!products){
        return res.status(404).json({error:"No Such Product"})
    }
    res.status(200).json(products)
}

//Update Product
const updateProduct = async(req,res)=>{
    const{id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error:"No such Product"})
    }
    const products = await Inventory.findOneAndUpdate({_id:id},{
        ...req.body
    })
    if(!products){
        return res.status(404).json({error:"No such Products"})
    }
    res.status(202).json(products)
}

//Add Stock
const addProducts = async(req,res)=>{
    const{id}= req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error:"No such Product"})
    }
    const products = await Inventory.findById(id)
    products.bill_number = req.body.bill_number
   // products.products_movement = req.body.quantity
    products.product_Instock += req.body.quantity
    products.save();
    res.status(202).json(products)
}


module.exports = {
    getallProducts,
    getSingleproduct,
    createProducts,
    deleteProduct,
    updateProduct,
    addProducts
}

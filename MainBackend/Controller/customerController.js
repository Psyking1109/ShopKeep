const mongoose = require('mongoose')
const Customers = require('../models/customerModel')


//Get All Customers
const getallCustomers = async(req,res)=>{
    const customers = await Customers.find()
    res.status(200).json(customers)
}


//Get Single Customers
const getSingleCustomer = async(req,res)=>{
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error:'No such Customers Found'})
    }
    const customer = await Customers.findById(id)
        .populate({
            path:'customerInvoice',
            select:'invoiceNumber balance'
        })
        .select('customer_Name customerInvoice');

    if(!customer){
        return res.status(404).json({error:'No Such Customers'})
    }
    const customerName = customer.customer_Name
    const customerInvoices = customer.customerInvoice.map(invoice =>({
        invoiceNumber:invoice.invoiceNumber,
        balance:invoice.balance
    }))


      console.log('Customer Name:', customerName);
      console.log('Invoice Numbers:',customerInvoices);

    res.status(200).json({
      customerName,
      customerInvoices
    });
}

//Create New Customer
const createCustomer = async(req,res)=>{
    const{
        customer_Name
    }=req.body
    
    let emptyFields = []
if(!customer_Name){
    emptyFields.push('customer_Name')
}
if(emptyFields.length > 0){
    return res.status(400).json({error: 'Please fill in all the fields ', emptyFields})
}
try{
    const customer =  await Customers.create({
        customer_Name
    })
    res.status(200).json(customer)
}catch(error){
    res.status(400).json({error:error.message})
}
}

//Delete Customer
const deleteCustomer = async(req,res)=>{
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error:"No Such customer"})
    }
    const customer = await Customers.findOneAndDelete({_id:id})
    if(!customer){
        return res.status(404).json({error:"No Such customer"})
    }
    res.status(200).json(customer)
}


//Update customers
const updateCustomer = async(req,res)=>{
    const{id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error:"No such customers"})
    }
    const customers = await Customers.findOneAndUpdate({_id:id},{
        ...req.body
    })
    if(!customers){
        return res.status(404).json({error:"No such customers"})
    }
    res.status(202).json(customers)
}

module.exports = {
    getallCustomers,
    getSingleCustomer,
    createCustomer,
    deleteCustomer,
    updateCustomer
}
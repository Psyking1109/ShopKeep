const Invoice = require('../models/invoicingModel')
const Inventory = require('../models/inventoryModel')
const Customer = require('../models/customerModel')
const  mongoose = require('mongoose')


//Get all Invoices
const getAllInvoices = async(req,res)=>{
    const invoices = await Invoice.find()
    res.status(200).json(invoices)
}

//Invoicing 
const invoicing = async(req,res)=>{
    if(!mongoose.Types.ObjectId.isValid(req.body.customerId)){
        return res.status(404).json({error:'No Such Customer'})
    }
    const customer = await Customer.findById(req.body.customerId)
    if(!customer){
        return res.status(404).json({error:'No Such Customer'})
    }
const products = []
let subtotal = 0
for (const product of req.body.products){
    const productsInDb = await Inventory.findById(product.productId)
    if(!productsInDb){
        return res.status(400).send('Involid Item !');     
    }
    if(productsInDb.product_Instock < product.quantity){
        return res.status(400).send('Not Enough in Stock !')
    }
    productsInDb.product_Instock -= product.quantity
    console.log("product Id - ",product.productId)
    console.log("product quantity - ",product.quantity)
     await productsInDb.save();
    subtotal += product.quantity * productsInDb.product_Price;
    products.push({
        product:productsInDb,
        quantity:product.quantity,
        price:productsInDb.product_Price
    });
    const total = subtotal

    const invoice = new Invoice({
        date: new Date,
        invoiceNumber:req.body.invoiceNumber,
        customer,
        products,
        subtotal,
        total
    });
    await invoice.save()

    res.send(invoice)
}
}


//Deleting a product from the invoice

const deleteProductfromInvoice = async(req,res)=>{
const invoice = await Invoice.findById(req.params.invoiceId);
if (!invoice) return res.status(400).send('Invalid invoice.');

const productIndex = invoice.products.findIndex(i => i.id ==req.params.productId)
if (productIndex === -1) return res.status(400).send('Invalid item.');

const product = invoice.products[productIndex]
invoice.products.splice(productIndex,1)
invoice.subtotal -= product.quantity * product.price
invoice.total = invoice.subtotal

await invoice.save()

res.send(invoice)

}

module.exports = {
    getAllInvoices,
    invoicing,
    deleteProductfromInvoice
}

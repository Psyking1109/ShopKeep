const express = require('express')
const {
    getAllInvoices,
    invoicing,
    deleteProductfromInvoice,
    getSingleInvoice
} = require('../Controller/invoicingController')

const {
    authenticateUser
} = require('../Controller/userController')
  

const invoiceRouter = express.Router()

//GET all invoices
invoiceRouter.get('/getAllInvoice',authenticateUser(['admin','sales']),getAllInvoices)

//Get Single Invoice 
invoiceRouter.get('/:invoiceId/get-singleInvoice',authenticateUser(['admin','sales']),getSingleInvoice)

//Invoicing
invoiceRouter.post('/',authenticateUser(['admin','sales']),invoicing)

//Deleting a product from Invoice
invoiceRouter.delete('/:invoiceId/product/:productId',authenticateUser(['admin','sales']),deleteProductfromInvoice)

module.exports = invoiceRouter
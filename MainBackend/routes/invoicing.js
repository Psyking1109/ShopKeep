const express = require('express')
const {
    getAllInvoices,
    invoicing,
    deleteProductfromInvoice
} = require('../Controller/invoicingController')

const {
    authenticateUser
} = require('../Controller/userController')
  

const invoiceRouter = express.Router()

//GET all invoices
invoiceRouter.get('/',authenticateUser(['admin','sales']),getAllInvoices)

//Invoicing
invoiceRouter.post('/',authenticateUser(['admin','sales']),invoicing)

//Deleting a product from Invoice
invoiceRouter.delete('/:invoiceId/product/:productId',authenticateUser(['admin','sales']),deleteProductfromInvoice)

module.exports = invoiceRouter
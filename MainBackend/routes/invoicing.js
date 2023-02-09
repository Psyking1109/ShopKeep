const express = require('express')
const {
    getAllInvoices,
    invoicing,
    deleteProductfromInvoice
} = require('../Controller/invoicingController')

const invoiceRouter = express.Router()

//GET all invoices
invoiceRouter.get('/',getAllInvoices)

//Invoicing
invoiceRouter.post('/',invoicing)

//Deleting a product from Invoice
invoiceRouter.delete('/:invoiceId/product/:productId',deleteProductfromInvoice)

module.exports = invoiceRouter
const Invoice = require('../models/invoicingModel')
const Inventory = require('../models/inventoryModel')
const Customer = require('../models/customerModel')
const Payment = require('../models/paymentModel')
const mongoose = require('mongoose')



//Get all Invoices
const getAllInvoices = async (req, res) => {
    const invoices = await Invoice.find()
    res.status(200).json(invoices)
}

//Invoicing 
const invoicing = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.body.customerId)) {
        return res.status(404).json({ error: 'No Such Customer' })
    }
    const customer = await Customer.findById(req.body.customerId)
    if (!customer) {
        return res.status(404).json({ error: 'No Such Customer' })
    }
    const products = []
    let subtotal = 0
    let productQuantity = 0



    const invoice = new Invoice({
        date: new Date,
        invoiceNumber: req.body.invoiceNumber,
        customer,

    });
    await invoice.save()
    res.send(invoice)

    //Get the current Invoice _id
    const invoice_id = await Invoice.findOne({invoiceNumber:req.body.invoiceNumber},{ _id: 1 })

    const invoice_details = await Invoice.findById(invoice_id)

    try {
        for (const product of req.body.products) {
            const productsInDb = await Inventory.findById(product.productId)
            if (!productsInDb) {
                return res.status(400).send('Invalid Item !');
            }

            console.log("product is Loose ? = ", product.isLoose)
            if (product.isLoose === false) {
                productQuantity = product.quantity * productsInDb.product_PerUnit
            } else {
                productQuantity = product.quantity
            }
            if (productsInDb.product_Instock < productQuantity) {
                return res.status(400).send('Not Enough in Stock !')
            }
            productsInDb.product_Instock -= productQuantity

            //Entering Stock to inventory
            const date = new Date()
            productsInDb.products_movement.push({
                date: date,
                bill_number: invoice_id,
                sold: productQuantity
            })
            console.log("product Id - ", product.productId)
            console.log("product quantity - ", productQuantity)
            await productsInDb.save();
            subtotal += productQuantity * productsInDb.product_Price;
            products.push({
                product: productsInDb,
                quantity: productQuantity,
                price: productsInDb.product_Price
            });
        }
        const total = subtotal


        const payments = []
        let paymentType = req.body.paymentType
        const paidAmount = req.body.paidAmount
        let balance = paidAmount - total
        let hasBalance = false


        if (paidAmount == balance) {
            hasBalance = true
                 payments.push({
                    paymentType :'Full_credit',
                        cashDetails: [{
                            date: new Date,
                            amount: paidAmount
                        }]
                })
        } 
            //check if there is Credit or debit
            if (paidAmount < total || paidAmount > total || balance != 0 ) {
                hasBalance = true
            }

                if (paymentType === 'cheque') {     
                        payments.push({
                            paymentType:'cheque',
                                chequeDetails: [{       
                                    BankName: req.body.bankName,
                                    bankBranch: req.body.bankBranch,
                                    datedTo: req.body.datedTo,
                                    amount:paidAmount
                                }]
                        })     
                } 
                    if (paymentType === 'bank') {
                       
                           payments.push({
                            paymentType:'bank', 
                                    bankDetails: [{                                 
                                        BankName: req.body.bankName,
                                        bankID: req.body.bankID,
                                        depositDate: req.body.depositDate,
                                        amount:paidAmount
                                    }]                  
                            })                                 
                    } 
                        if (paymentType === 'cash') {
                                payments.push({
                                    paymentType:'cash',
                                    cashDetails: [{
                                        date: req.body.depositDate,
                                        amount:paidAmount
                                    }]
                                })             
                        }

                        let totalPaid = 0;
                        for (let i = 0; i < payments.length; i++) {
                          const payment = payments[i];
                          for (let method in payment) {
                            const amount = payment[method].amount;
                            totalPaid += amount;
                          }
                        }
                        balance = totalPaid - total

            const paymentDetails = new Payment({
                customerName:customer,
                ivoiceNumber:invoice_id,
                hasBalance:hasBalance,
                paymentDetails:payments,
                paidAmount:totalPaid,
                balance:balance
            })
            await paymentDetails.save()
            res.status(200).json(paymentDetails)

            const payment_id = await Invoice.findOne({invoiceNumber:invoice_id},{ _id: 1 })

            invoice_details.products.push(products)
            invoice_details.paymentDetails = payment_id
            invoice_details.subtotal = subtotal
            invoice_details.total = total

            await invoice_details.save()
           
                        
            
       
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}


//Deleting a product from the invoice

const deleteProductfromInvoice = async (req, res) => {
    const invoice = await Invoice.findById(req.params.invoiceId);
    if (!invoice) return res.status(400).send('Invalid invoice.');

    const productIndex = invoice.products.findIndex(i => i.id == req.params.productId)
    if (productIndex === -1) return res.status(400).send('Invalid item.');

    const product = invoice.products[productIndex]
    invoice.products.splice(productIndex, 1)
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

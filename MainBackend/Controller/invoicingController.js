const Invoice = require('../models/invoicingModel')
const Inventory = require('../models/inventoryModel')
const Customer = require('../models/customerModel')
const Bank = require('../models/bankModel')
const Cheque = require('../models/chequeModel')
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
                bill_number: req.body.invoiceNumber,
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

        const payment = []
        const paymentType = req.body.paymentType
        const paidAmount = req.body.paidAmount
        const balance = paidAmount - total
        const hasBalance = false
        const hasDebit = false

        if (paidAmount == balance) {

            paymentType = 'Full_credit';
            hasBalance = true
            customer.customerPayment.push({
                invoiceNumber: req.body.invoiceNumber,
                billDate: new Date,
                balanceAmount: balance,
                paymentType: 'Full_credit'
            })
            try {
                const paymentMade = new Payment.create({
                    customerName: customer,
                    ivoiceNumber: req.body.invoiceNumber,
                    hasBalance: true,
                    paidAmount: paidAmount,
                    balance: balance
                })
                await paymentMade.save();
                res.status(200).json(paymentMade)
            } catch (error) {
                res.status(400).json({ error: error.message })
            }

        } else
            if (paidAmount < total || balance != 0) {
                hasBalance = true
                customer.customerPayment.push({
                    invoiceNumber: req.body.invoiceNumber,
                    billDate: new Date,
                    balanceAmount: balance,
                    paymentType: paymentType
                })

                if (paymentType == 'cheque') {
                    try {
                        const paymentMade = new Payment.create({
                            customerName: customer,
                            ivoiceNumber: req.body.invoiceNumber,
                            hasBalance: hasBalance,
                            paymentDetails: [{
                                paymentType: paymentType,
                                chequeDetails: [{
                                    BankName: req.body.bankName,
                                    bankBranch: req.body.bankBranch,
                                    datedTo: req.body.datedTo
                                }]
                            }],
                            paidAmount: paidAmount,
                            balance: balance
                        })
                        await paymentMade.save();
                        res.status(200).json(paymentMade)
                    } catch (error) {
                        res.status(400).json({ error: error.message })
                    }
                } else

                    if (paymentType == 'bank') {
                        try {
                            const paymentMade = new Payment.create({
                                customerName: customer,
                                ivoiceNumber: req.body.invoiceNumber,
                                hasBalance: hasBalance,
                                paymentDetails: [{
                                    paymentType: paymentType,
                                    bankDetails: [{
                                        BankName: req.body.bankName,
                                        bankID: req.body.bankID,
                                        depositDate: req.body.depositDate
                                    }]
                                }],
                                paidAmount: paidAmount,
                                balance: balance
                            })
                            await paymentMade.save();
                            res.status(200).json(paymentMade)
                        } catch (error) {
                            res.status(400).json({ error: error.message })
                        }
                    } else

                        if (paymentType == 'cash') {
                            try {
                                const paymentMade = new Payment.create({
                                    customerName: customer,
                                    ivoiceNumber: req.body.invoiceNumber,
                                    hasBalance: hasBalance,
                                    paidAmount: paidAmount,
                                    balance: balance
                                })
                                await paymentMade.save();
                                res.status(200).json(paymentMade)
                            } catch (error) {
                                res.status(400).json({ error: error.message })
                            }
                        }

            }else 
            if (paidAmount > total || balance > 0) {
                hasDebit = true
                customer.customerPayment.push({
                    invoiceNumber: req.body.invoiceNumber,
                    billDate: new Date,
                    balanceAmount: balance,
                    paymentType: paymentType
                })

                if (paymentType == 'cheque') {
                    try {
                        const paymentMade = new Payment.create({
                            customerName: customer,
                            ivoiceNumber: req.body.invoiceNumber,
                            hasDebit: hasDebit,
                            paymentDetails: [{
                                paymentType: paymentType,
                                chequeDetails: [{
                                    BankName: req.body.bankName,
                                    bankBranch: req.body.bankBranch,
                                    datedTo: req.body.datedTo
                                }]
                            }],
                            paidAmount: paidAmount,
                            balance: balance
                        })
                        await paymentMade.save();
                        res.status(200).json(paymentMade)
                    } catch (error) {
                        res.status(400).json({ error: error.message })
                    }
                } else
                    if (paymentType == 'bank') {
                        try {
                            const paymentMade = new Payment.create({
                                customerName: customer,
                                ivoiceNumber: req.body.invoiceNumber,
                                hasDebit: hasDebit,
                                paymentDetails: [{
                                    paymentType: paymentType,
                                    bankDetails: [{
                                        BankName: req.body.bankName,
                                        bankID: req.body.bankID,
                                        depositDate: req.body.depositDate
                                    }]
                                }],
                                paidAmount: paidAmount,
                                balance: balance
                            })
                            await paymentMade.save();
                            res.status(200).json(paymentMade)
                        } catch (error) {
                            res.status(400).json({ error: error.message })
                        }
                    } else
                        if (paymentType == 'cash') {
                            try {
                                const paymentMade = new Payment.create({
                                    customerName: customer,
                                    ivoiceNumber: req.body.invoiceNumber,
                                    hasDebit: hasDebit,
                                    paidAmount: paidAmount,
                                    balance: balance
                                })
                                await paymentMade.save();
                                res.status(200).json(paymentMade)
                            } catch (error) {
                                res.status(400).json({ error: error.message })
                            }
                        }

            }
        payment.push({
            paymentType: paymentType,
            paidAmount: paidAmount,
            hasBalance: hasBalance
        })

        const invoice = new Invoice({
            date: new Date,
            invoiceNumber: req.body.invoiceNumber,
            customer,
            products,
            subtotal,
            total,
            payment
        });
        await invoice.save()
        res.send(invoice)
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

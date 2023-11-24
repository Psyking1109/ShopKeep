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

    const savedInvoice = await invoice.save()
    //Get the current Invoice _id


    try {
        if (!mongoose.Types.ObjectId.isValid(savedInvoice._id)) {
            return res.status(404).json({ error: 'No Such bills' })
        } else {
            console.log("no isses here")
        }
        console.log(savedInvoice._id)

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
        const newQuantity =  productsInDb.product_Instock - productQuantity
            console.log("product in stock",newQuantity)
            //Entering Stock to inventory
            const date = new Date()
          const newEntry =   await Inventory.findByIdAndUpdate(
                productsInDb._id,
                {
                    product_Instock:newQuantity,
                    $push: {   
                        products_movement: {
                            date: date,
                            bill_number: savedInvoice._id,
                            sold: productQuantity
                        }
                    }
                }
            );
            console.log("New Entry- ", newEntry.product_Instock)
          //  console.log("product quantity - ", productQuantity)

            subtotal += productQuantity * productsInDb.product_Price;
            products.push({
                product: productsInDb._id.toString(),
                quantity: productQuantity,
                price: productsInDb.product_Price
            });
           
        }

        const total = subtotal
        console.log("total ", total)

        const payments = []
        let hasBalance = false

        //check if there is Credit or debit

        for (const payment of req.body.payments) {
          
            const paymentType = payment.paymentType
            const paidAmount = payment.amount
         

            if (paymentType === 'cheque') {
                             
                payments.push({
                    paymentType: 'cheque',
                    chequeDetails: payment.chequeDetails
                })
                
            }
            if (paymentType === 'bank') {
              
                payments.push({
                    paymentType: 'bank',
                    bankDetails: [{
                        BankName: payment.bankDetails.bankName,
                        bankID: payment.bankDetails.bankID,
                        depositDate: payment.bankDetails.depositDate,
                        amount: payment.bankDetails.amount
                    }]
                })
                                           
            }
            if (paymentType === 'cash') {
             
                payments.push({
                    paymentType: 'cash',
                    cashDetails: payment.cashDetails
                })
                

            }

            if (paidAmount == 0) {
                hasBalance = true
                payments.push({
                    paymentType: 'Full_credit',
                    amount: paidAmount
                })
            }

        }

        let totalPaid = 0;
        for (let i = 0; i < payments.length; i++) {
            const payment = payments[i];

            if (payment.paymentType === 'cheque') {
                for (const detail of payment.chequeDetails) {
                    totalPaid += detail.amount;
                }
            } else if (payment.paymentType === 'bank') {
                for (const detail of payment.bankDetails) {
                    totalPaid += detail.amount;
                }
            } else if (payment.paymentType === 'cash') {
                for (const detail of payment.cashDetails) {
                    totalPaid += detail.amount;
                }
            }
        }

        const balance = totalPaid - total
        console.log("total paid", totalPaid)
        if (totalPaid < total || totalPaid > total || balance != 0) {
            hasBalance = true
        }

        const paymentDetails = new Payment({
            customerName: customer,
            ivoiceNumber: mongoose.Types.ObjectId(savedInvoice._id),
            hasBalance: hasBalance,
            paymentDetails: payments,
            paidAmount: totalPaid,
            balance: balance
        })
        const paymentId = await paymentDetails.save()
        console.log("payment details ", paymentDetails)


        const invoice_details = await Invoice.findById(savedInvoice._id)

        console.log("payment_id ", paymentId._id)
        invoice_details.products.push(...products);
        invoice_details.paymentDetails = paymentId._id;
        invoice_details.subtotal = subtotal;
        invoice_details.total = total;
        await invoice_details.save();

        return res.status(200).json(paymentDetails)

    } catch (error) {
        return res.status(500).json({ error: error.message })
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

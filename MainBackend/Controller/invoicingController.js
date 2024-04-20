const mongoose = require('mongoose')

//models
const Invoice = require('../models/invoicingModel')
const Inventory = require('../models/inventoryModel')
const Customer = require('../models/customerModel')
const Payment = require('../models/paymentModel')
const bankModel = require('../models/bankModel')
const cashModel = require('../models/cashModel')
const chequeModel = require('../models/chequeModel')
const transactionTypeModel = require('../models/transationTypeModel')

//functions
const {
    chequePayment,
    bankPayment,
    cashPayment
} = require('../fuctions/paymentFunctions')




//Get all Invoices
const getAllInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find();
        res.status(200).json(invoices);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error retrieving invoices' });
    }
};

//Get single invoice 
const getSingleInvoice = async (req, res) => {
    const invoiceId = req.params.invoiceId;
    try {
        const invoice = await Invoice.findById(invoiceId);
        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }
        res.status(200).json(invoice);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error retrieving invoice' });
    }
};

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


    const transactionTypeModelId = await transactionTypeModel.findOne({ transactionType: "sales" })
    //console.log("transactionTypeID - ",transactionTypeModelId)

    try {
        if (!mongoose.Types.ObjectId.isValid(savedInvoice._id)) {
            return res.status(404).json({ error: 'No Such bills' })
        } else {

        }
        customer.customerInvoice.push(savedInvoice._id)
        await customer.save()


        for (const product of req.body.products) {
            const productsInDb = await Inventory.findById(product.productId)
            if (!productsInDb) {
                return res.status(400).send('Invalid Item !');
            }

            //   console.log("product is Loose ? = ", product.isLoose)
            if (product.isLoose === false) {
                productQuantity = product.quantity * productsInDb.product_PerUnit
                const prodCost = productsInDb.product_Price / productsInDb.product_PerUnit
                subtotal += productQuantity * prodCost;
            } else {
                productQuantity = product.quantity
                subtotal += productQuantity * productsInDb.product_loosePrice;
            }
            if (productsInDb.product_Instock < productQuantity) {
                return res.status(400).send('Not Enough in Stock !')
            }

            const newQuantity = productsInDb.product_Instock - productQuantity

            //Entering Stock to inventory
            const date = new Date()
            const savedInventory = await Inventory.findByIdAndUpdate(
                productsInDb._id,
                {
                    product_Instock: newQuantity,
                    $push: {
                        products_movement: {
                            date: date,
                            bill_number: savedInvoice._id,
                            sold: productQuantity
                        }
                    }
                },
                { new: true }
            )
            if (savedInventory) {
                const productMovemntId = savedInventory.products_movement[savedInventory.products_movement.length - 1]._id

                products.push({
                    productDetail: productMovemntId,
                    price: subtotal
                });

            } else {
                console, log("no documents found ")
            }


            //  subtotal += productQuantity * productsInDb.product_Price;

        }

        const total = subtotal
        console.log("total ", total)

        let totalPaid = 0;
        const payments = []
        let hasBalance = false

        //check if there is Credit or debit

        for (const payment of req.body.payments) {

            const paymentType = payment.paymentType
            const paidAmount = payment.amount


            if (paymentType === 'cheque') {
                /*
                payments.push({
                    paymentType: 'cheque',
                  chequeDetails: payment.chequeDetails
                })
                */
                const reqBody = req.body;
                const chequePaymentDetails = reqBody.payments.find(payment => payment.paymentType === 'cheque')


                const getpaid = await chequePayment(req, chequePaymentDetails, chequeModel, payments, transactionTypeModelId, savedInvoice)
                totalPaid += getpaid

            }
            if (paymentType === 'bank') {

                const reqBody = req.body;

                const bankPaymentDetails = reqBody.payments.find(payment => payment.paymentType === 'bank')

              const getPaid =   await bankPayment(req, bankPaymentDetails, bankModel, payments, transactionTypeModelId, savedInvoice)
              totalPaid +=getPaid
                /*
                payments.push({
                    paymentType: 'bank',
                    bankDetails: [{
                        BankName: payment.bankDetails.bankName,
                        bankID: payment.bankDetails.bankID,
                        depositDate: payment.bankDetails.depositDate,
                        amount: payment.bankDetails.amount
                    }]
                })
                */





            }
            if (paymentType === 'cash') {
                const reqBody = req.body;

                const cashPaymentDetails = reqBody.payments.find(payment => payment.paymentType === 'cash');


                console.log("Cash Account ID:", cashPaymentDetails);

               const getPaid =  await cashPayment(req, cashPaymentDetails, cashModel, payments, transactionTypeModelId, savedInvoice)
                totalPaid+=getPaid

                /*
                payments.push({
                    paymentType: 'cash',
                    cashDetails: payment.cashDetails
                })
                */

            }

            if (paidAmount == 0) {
                hasBalance = true
                payments.push({
                    paymentType: 'Full_credit',
                    // amount: paidAmount
                })
            }

        }

        /*  
          for (let i = 0; i < payments.length; i++) {
              const payment = payments[i];
  
              if (payment.paymentType === 'cheque') {
              //    for (const detail of payment.chequeDetails) {
                //      totalPaid += detail.amount;
                 // }            
                      chequeModel.findById(payment.chequeDetails)
                     .then(chequedetails =>{
                         totalPaid += chequedetails.amount;
                     })
                     .catch(error => {
                         console.error("Error retrieving transaction amount:", error);
                     })                  
      
         
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
  */
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
        })
        const paymentId = await paymentDetails.save()


        console.log("payment details ", paymentDetails)


        const invoice_details = await Invoice.findById(savedInvoice._id)

        console.log("payment_id ", paymentId._id)
        invoice_details.products.push(...products);
        invoice_details.paymentDetails = paymentId._id;
        invoice_details.subtotal = subtotal;
        invoice_details.total = total;
        invoice_details.balance = balance;
        invoice_details.hasBalance = hasBalance
        const invoice = await invoice_details.save();



        return res.status(200).json({
            paymentDetails,
            invoice
        })

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
    deleteProductfromInvoice,
    getSingleInvoice
}

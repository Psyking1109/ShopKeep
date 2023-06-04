const Invoice = require('../models/invoicingModel');
const Inventory = require('../models/inventoryModel');
const Customer = require('../models/customerModel');
const Bank = require('../models/bankModel');
const Cheque = require('../models/chequeModel');
const Payment = require('../models/paymentModel');
const mongoose = require('mongoose');

// Get all Invoices
const getAllInvoices = async (req, res) => {
  const invoices = await Invoice.find();
  res.status(200).json(invoices);
};

// Invoicing
const invoicing = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.body.customerId)) {
    return res.status(404).json({ error: 'No Such Customer' });
  }
  const customer = await Customer.findById(req.body.customerId);
  if (!customer) {
    return res.status(404).json({ error: 'No Such Customer' });
  }

  const products = [];
  let subtotal = 0;
  let productQuantity = 0;

  try {
    for (const product of req.body.products) {
      const productsInDb = await Inventory.findById(product.productId);
      if (!productsInDb) {
        return res.status(400).send('Invalid Item!');
      }

      console.log('Product is Loose? = ', product.isLoose);
      if (product.isLoose === false) {
        productQuantity = product.quantity * productsInDb.product_PerUnit;
      } else {
        productQuantity = product.quantity;
      }
      if (productsInDb.product_Instock < productQuantity) {
        return res.status(400).send('Not Enough in Stock!');
      }
      productsInDb.product_Instock -= productQuantity;

      // Entering Stock to inventory
      const date = new Date();
      productsInDb.products_movement.push({
        date: date,
        bill_number: req.body.invoiceNumber,
        sold: productQuantity,
      });
      console.log('Product Id - ', product.productId);
      console.log('Product quantity - ', productQuantity);
      await productsInDb.save();
      subtotal += productQuantity * productsInDb.product_Price;
      products.push({
        product: productsInDb,
        quantity: productQuantity,
        price: productsInDb.product_Price,
      });
    }

    const total = subtotal;
    const payment = [];
    let paymentType = req.body.paymentType;
    const paidAmount = req.body.paidAmount;
    const balance = paidAmount - total;
    let hasBalance = false;
    let hasDebit = false;

    if (paidAmount == balance) {
      paymentType = 'Full_credit';
      hasBalance = true;
      customer.payments.push({
        invoiceNumber: req.body.invoiceNumber,
        billDate: new Date(),
        balanceAmount: balance,
        paymentType: 'Full_credit',
      });
      try {
        const paymentMade = new Payment({
          customerName: customer,
          invoiceNumber: req.body.invoiceNumber,
          hasBalance: true,
          paymentDetails: [
            {
              paymentType: paymentType,
              cashDetails: [
                {
                  date: new Date(),
                  amount: paidAmount,
                },
              ],
            },
          ],
          paidAmount: paidAmount,
          balance: balance,
        });
        await paymentMade.save();
        res.status(200).json(paymentMade);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    } else if (paidAmount < total || balance != 0) {
      hasBalance = true;
      customer.payments.push({
        invoiceNumber: req.body.invoiceNumber,
        billDate: new Date(),
        balanceAmount: balance,
        paymentType: paymentType,
      });
      if (balance < 0) {
        hasDebit = true;
      }

      try {
        const paymentMade = new Payment({
          customerName: customer,
          invoiceNumber: req.body.invoiceNumber,
          hasBalance: hasBalance,
          hasDebit: hasDebit,
          paymentDetails: [
            {
              paymentType: paymentType,
              cashDetails: [
                {
                  date: new Date(),
                  amount: paidAmount,
                },
              ],
            },
          ],
          paidAmount: paidAmount,
          balance: balance,
        });
        await paymentMade.save();
        res.status(200).json(paymentMade);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }

    await customer.save();

    const invoice = new Invoice({
      invoiceNumber: req.body.invoiceNumber,
      customer: customer._id,
      products: products,
      subtotal: subtotal,
      total: total,
      balance: balance,
    });
    await invoice.save();
    res.status(201).json(invoice);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete product from invoice
const deleteProductfromInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.body.invoiceId);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    const productIndex = invoice.products.findIndex(
      (product) => product._id.toString() === req.body.productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found in invoice' });
    }

    const deletedProduct = invoice.products.splice(productIndex, 1);
    await invoice.save();

    res.status(200).json(deletedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAllInvoices,
  invoicing,
  deleteProductfromInvoice,
};

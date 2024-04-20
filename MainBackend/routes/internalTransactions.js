const express = require('express')

const {transferAmount} = require('../Controller/internalTransactionsController')

const {
    authenticateUser
} = require('../Controller/userControllers')


const internalTransactionsRouter = express.Router()

//internal Transactions
internalTransactionsRouter.post('/:sourceAccountType/transferTo/:destinationAccountType',authenticateUser(['admin']),transferAmount)

module.exports = internalTransactionsRouter

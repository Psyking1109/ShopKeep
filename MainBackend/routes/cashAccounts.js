const express = require('express')

const {
    createCashAccount,
    getCashAccountById,
    updateCashTransaction,
    deleteCashTransaction,
    deleteCashAccount,
    updateCashAccount,
    getAllTransactions,
    getBalance
} = require('../Controller/cashAccountController')

const {
    authenticateUser
} = require('../Controller/userControllers')
  

const cashAccountRouter = express.Router()

//get all cash Accounts
cashAccountRouter.get('/:accountId',authenticateUser(['admin','accounts']),getCashAccountById)

//create cash accounts
cashAccountRouter.post('/create-cashAccount',authenticateUser(['admin','accounts']),createCashAccount)

//update cash details
cashAccountRouter.patch('/:accountId/update-cashDetails',authenticateUser(['admin','accounts']),updateCashAccount)

//delete cash account 
cashAccountRouter.delete('/:accountId/update-cashDetails',authenticateUser(['admin','accounts']),deleteCashAccount)

//update transactions
cashAccountRouter.patch('/:accountId/:transactionId/update-cashDetails',authenticateUser(['admin','accounts']),updateCashTransaction)

//delete transactions
cashAccountRouter.delete('/:accountId/:transactionId/update-cashDetails',authenticateUser(['admin','accounts']),deleteCashTransaction)

//get cash Balance
cashAccountRouter.get('/:accountId',authenticateUser(['admin','accounts']),getBalance)

//get transactions
cashAccountRouter.get('/accountId',authenticateUser(['admin','accounts']),getAllTransactions)

module.exports = cashAccountRouter
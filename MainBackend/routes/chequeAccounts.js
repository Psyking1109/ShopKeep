const express = require('express')

const {
    createChequeAccount,
    getChequeAccountById,
    updateChequeTransaction,
    deleteChequeTransaction,
    deleteChequeAccount,
    updateChequeAccount,
    getBalance,
    getAllTransactions
} = require('../Controller/chequeAccountController')

const {
    authenticateUser
} = require('../Controller/userControllers')
  

const chequeAccountRouter = express.Router()

//get all cheque Accounts
chequeAccountRouter.get('/:accountId',authenticateUser(['admin','accounts']),getChequeAccountById)

//create cheque accounts
chequeAccountRouter.post('/create-chequeAccount',authenticateUser(['admin','accounts']),createChequeAccount)

//update cheque details
chequeAccountRouter.patch('/:accountId/update-chequeDetails',authenticateUser(['admin','accounts']),updateChequeAccount)

//delete cheque account 
chequeAccountRouter.delete('/:accountId/update-chequeDetails',authenticateUser(['admin','accounts']),deleteChequeAccount)

//update transactions
chequeAccountRouter.patch('/:accountId/:transactionId/update-chequeDetails',authenticateUser(['admin','accounts']),updateChequeTransaction)

//delete transactions
chequeAccountRouter.delete('/:accountId/:transactionId/update-chequeDetails',authenticateUser(['admin','accounts']),deleteChequeTransaction)

//get cheque Balance
chequeAccountRouter.get('/:accountId',authenticateUser(['admin','accounts']),getBalance)

//get transactions
chequeAccountRouter.get('/accountId',authenticateUser(['admin','accounts']),getAllTransactions)

module.exports =chequeAccountRouter
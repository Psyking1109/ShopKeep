const express = require('express')

const {
    createBankAccount,
    getBankAccountById,
    updateTransaction,
    deleteTransaction,
    deleteBankAccount,
    updateBankAccount,
    getBalance,
    getAllTransactions
} = require('../Controller/BankAccountController')

const {
    authenticateUser
} = require('../Controller/userControllers')
  

const bankAccountRouter = express.Router()

//get bank Accounts by id
bankAccountRouter.get('/:accountId', authenticateUser(['admin', 'accounts']), getBankAccountById)

//create bank accounts
bankAccountRouter.post('/create-BankAccount', authenticateUser(['admin', 'accounts']), createBankAccount)

//update bank details
bankAccountRouter.patch('/:accountId/update-bankDetails', authenticateUser(['admin', 'accounts']), updateBankAccount)

//delete bank account 
bankAccountRouter.delete('/:accountId', authenticateUser(['admin', 'accounts']), deleteBankAccount)

//update transactions
bankAccountRouter.patch('/:accountId/:transactionId', authenticateUser(['admin', 'accounts']), updateTransaction)

//delete transactions
bankAccountRouter.delete('/:accountId/:transactionId', authenticateUser(['admin', 'accounts']), deleteTransaction)

//get Bank Balance
bankAccountRouter.get('/:accountId/balance', authenticateUser(['admin', 'accounts']), getBalance)


//get transactions
bankAccountRouter.get('/:accountId/transactions', authenticateUser(['admin', 'accounts']), getAllTransactions)


module.exports = bankAccountRouter
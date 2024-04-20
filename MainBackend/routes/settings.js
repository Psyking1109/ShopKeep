const express = require('express')

const{
    createTransactionType
} = require('../Controller/transactionTypeController')

const {
    authenticateUser
} = require('../Controller/userControllers')
  

const settingRouter = express.Router()


settingRouter.post('/createTransactionType',authenticateUser(['admin']),createTransactionType)


module.exports = settingRouter
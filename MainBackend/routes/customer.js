const express = require('express')

const {
    getallCustomers,
    getSingleCustomer,
    createCustomer,
    deleteCustomer,
    updateCustomer
} = require('../Controller/customerController')

const {
    authenticateUser
} = require('../Controller/userControllers')
  


const customerRouter = express.Router()

//Get all Customers
customerRouter.get('/',authenticateUser(['admin']),getallCustomers)

//Get single Customer
customerRouter.get('/:id/get-singlecustomers',authenticateUser(['admin']),getSingleCustomer)

//Add a new Customers
customerRouter.post('/create-customer',authenticateUser(['admin']),createCustomer)

//Delete a Customers
customerRouter.delete('/:id/delete-customers',authenticateUser(['admin']),deleteCustomer)

//Update a Customers
customerRouter.patch('/:id/update-customers',authenticateUser(['admin']),updateCustomer)

module.exports = customerRouter
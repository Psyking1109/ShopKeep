const express = require('express')

const {
    getallCustomers,
    getSingleCustomer,
    createCustomer,
    deleteCustomer,
    updateCustomer
} = require('../Controller/customerController')

const customerRouter = express.Router()

//Get all Customers
customerRouter.get('/',getallCustomers)

//Get single Customer
customerRouter.get('/:id/get-singlecustomers',getSingleCustomer)

//Add a new Customers
customerRouter.post('/create-customer',createCustomer)

//Delete a Customers
customerRouter.delete('/:id/delete-customers',deleteCustomer)

//Update a Customers
customerRouter.patch('/:id/update-customers',updateCustomer)

module.exports = customerRouter
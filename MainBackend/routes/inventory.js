const express = require('express')
const {
    getallProducts,
    getSingleproduct,
    createProducts,
    deleteProduct,
    updateProduct,
    addProducts
} = require('../Controller/inventoryController')

const {
    authenticateUser
} = require('../Controller/userController')
  
  


const inventoryRouter = express.Router()

//Get all Products
inventoryRouter.get('/',authenticateUser(['admin','stock','sales']),getallProducts)

//Get single Product
inventoryRouter.get('/:id/get-singleproduct',authenticateUser(['admin','stock','sales']),getSingleproduct)

//Add a new Product
inventoryRouter.post('/create-product',authenticateUser(['admin','stock','sales']),createProducts)

//Delete a Product
inventoryRouter.delete('/:id/delete-product',authenticateUser(['admin','stock','sales']),deleteProduct)

//Update a product
inventoryRouter.patch('/:id/update-product',authenticateUser(['admin','stock','sales']),updateProduct)

//Add Quanitity to Product
inventoryRouter.put('/:id/add-quantity',authenticateUser(['admin','stock','sales']),addProducts)

module.exports = inventoryRouter
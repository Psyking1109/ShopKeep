const express = require('express')
const {
    getallProducts,
    getSingleproduct,
    createProducts,
    deleteProduct,
    updateProduct,
    addProducts
} = require('../Controller/inventoryController')

const inventoryRouter = express.Router()

//Get all Products
inventoryRouter.get('/',getallProducts)

//Get single Product
inventoryRouter.get('/:id/get-singleproduct',getSingleproduct)

//Add a new Product
inventoryRouter.post('/create-product',createProducts)

//Delete a Product
inventoryRouter.delete('/:id/delete-product',deleteProduct)

//Update a product
inventoryRouter.patch('/:id/update-product',updateProduct)

//Add Quanitity to Product
inventoryRouter.put('/:id/add-quantity',addProducts)

module.exports = inventoryRouter
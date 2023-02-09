const express = require('express')

const {
    registerUser,
    login
} = require('../controller/userController')

const userRouter = express.Router()

//Register User
userRouter.post('/',registerUser)

//Login
userRouter.get('/login',login)


module.exports = userRouter
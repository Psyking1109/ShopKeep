const express = require('express')

const {
    registerUser,
    login
} = require('../Controller/userControllers')

const userRouter = express.Router()

//Register User
userRouter.post('/register',registerUser)

//Login
userRouter.post('/login',login)





module.exports = userRouter
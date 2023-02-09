 require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const InvoicingRoute = require('./routes/invoicing')
const InventoryRoute = require('./routes/inventory')
const CustomerRoute = require('./routes/customer')


app.use(express.json())
app.use((req,res,next)=>{
    console.log(req.path, req.method)
    next()
})


//routes
app.use('/api/invoicing',InvoicingRoute)
app.use('/api/inventory',InventoryRoute)
app.use('/api/customer',CustomerRoute)

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`))
})
.catch((error)=>{
    console.log(error)
})


 require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')

//routes
const InvoicingRoute = require('./routes/invoicing')
const InventoryRoute = require('./routes/inventory')
const CustomerRoute = require('./routes/customer')
const UserRoute = require('./routes/user')
const BankAccountRoute = require('./routes/bankAccount')
const CashAccountRoute = require('./routes/cashAccounts')
const ChequeAccountRoute = require('./routes/chequeAccounts')
const SettingsRoute = require('./routes/settings')
const InternalTransactionsRoute = require('./routes/internalTransactions')

app.use(cors())
app.use(express.json())
app.use((req,res,next)=>{
    console.log(req.path, req.method)
    next()
})
mongoose.set('strictQuery', false);


//routes
app.use('/api/invoicing',InvoicingRoute)
app.use('/api/inventory',InventoryRoute)
app.use('/api/customer',CustomerRoute)
app.use('/api/user',UserRoute)
app.use('/api/bankAccount',BankAccountRoute)
app.use('/api/cashAccount',CashAccountRoute)
app.use('/api/chequeAccount',ChequeAccountRoute)
app.use('/api/Settings',SettingsRoute)
app.use('/api/internaltransactions',InternalTransactionsRoute)

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`))
})
.catch((error)=>{
    console.log(error)
})


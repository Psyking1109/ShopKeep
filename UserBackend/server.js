const express = require('express')
const app = express()
const mongoose = require('mongoose')
const RegisterRoute = require('./routes/user')

app.use(express.json())


app.use('/api/register',RegisterRoute)



mongoose.connect("mongodb+srv://niland:nanoNANO1109@todolist.lcqu6.mongodb.net/shopkeeping?retryWrites=true&w=majority")
.then(()=>{
    app.listen(3000, () => console.log(`Example app listening on port ${3000}!`))
})
.catch((error)=>{
    console.log(error)
})

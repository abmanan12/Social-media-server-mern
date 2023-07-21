require('dotenv').config();
require('./db/connect');

// "type": "module" in package.json
// import express from 'express' 
const express = require('express')
const app = express()

app.use(express.json())

app.use(require('./routes/authRoute'))
app.use(require('./routes/userRoute'))
app.use(require('./routes/postRoute'))


app.listen(process.env.PORT, () => {
    console.log('Server has been started');
})
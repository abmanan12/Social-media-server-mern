require('dotenv').config();
require('./db/connect');

// "type": "module" in package.json
// import express from 'express' 
const express = require('express')
const app = express()

app.use(express.json({
    credentials: true
}))

const cors = require('cors')
app.use(cors())

app.use(express.static('public'));
app.use('/images', express.static('images'));

app.use(require('./routes/authRoute'))
app.use(require('./routes/userRoute'))
app.use(require('./routes/postRoute'))
app.use(require('./routes/imageRoute'))
app.use(require('./routes/chatRoute'))
app.use(require('./routes/messageRoute'))


app.listen(process.env.PORT, () => {
    console.log('Server has been started');
})
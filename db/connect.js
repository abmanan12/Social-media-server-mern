// import mongoose from 'mongoose' 
const mongoose = require('mongoose')

const mongo_URL = process.env.DB_URL

mongoose.connect(mongo_URL, { useNewURLParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connection Successfull');
    }).catch(err => console.log(err))
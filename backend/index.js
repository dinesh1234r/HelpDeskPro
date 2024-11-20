const express = require('express');
const app = express();
const mongoose = require('mongoose');
const helmet = require('helmet');
const Customer=require('./Routes/customer')
const cors = require('cors');
const Ticket=require('./Routes/Ticket')

require('dotenv').config();

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Connection to DB established...');
    })
    .catch((error) => {
        console.error('Error in DB connection:', error);
    });

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to DB');
});
mongoose.connection.on('error', (err) => {
    console.log('Mongoose connection error:', err);
});
mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

app.use(helmet());
app.use(express.json());
app.use(cors());
app.use('/customer',Customer)
app.use('/report',Ticket)

app.listen(5000, () => {
    console.log('Backend started running...');
});

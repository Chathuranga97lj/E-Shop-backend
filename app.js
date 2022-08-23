const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const { json } = require('express');

require('dotenv/config');

const api = process.env.API_URL;

// for identify post reqest json file format (Middleware)
app.use(express.json());
app.use(morgan('tiny'));

// import product schema
const Product = require('./models/product');

// http://localhost:3000/api/v1/....
// get date from db or storages
app.get(`${api}/products`, async (req, res) => {
    const productList = await Product.find();

    if(!productList){
        res.status(500).json({success: false})
    }
    res.send(productList);
});

// send data to frontend
app.post(`${api}/products`, (req, res) => {
    const product = new Product({
        name: req.body.name,
        image: req.body.image,
        countInStock: req.body.countInStock
    })

    product.save().then((createProduct => {
        res.status(201).json(createProduct)
    })).catch((err) => {
        res.status(500).json({
            error: err,
            success: false
        })
    })
});

// add befor starting the server 
mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'eshop-database'
})
.then(() => {
    console.log('Database connection is ready.....')
})
.catch((err) => {
    console.log(err);
})

app.listen(3000, () => {
    console.log('server is running http://localhost:3000');
})
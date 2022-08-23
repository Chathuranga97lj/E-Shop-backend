const Product = require('../models/product');
const express = require('express');
const router = express.Router();

// http://localhost:3000/api/v1/....
// get date from db or storages
router.get(`/`, async (req, res) => {
    const productList = await Product.find();

    if(!productList){
        res.status(500).json({success: false})
    }
    res.send(productList);
});

// send data to frontend
router.post(`/`, (req, res) => {
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

module.exports = router;
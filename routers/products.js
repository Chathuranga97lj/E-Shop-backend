const {Product} = require('../models/product');
const express = require('express');
const { Category } = require('../models/category');
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
router.post(`/`, async (req, res) => {

    // validate category
    const category = await Category.findById(req.body.category);
    if(!category) return res.status(400).send('Invalid Category');

    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured
    })

    product = await product.save();  
    
    if(!product)
        return res.status(500).send('The product connot be created');
   
    res.send(product);    
    // product.save().then((createProduct => {
    //     res.status(201).json(createProduct)
    // })).catch((err) => {
    //     res.status(500).json({
    //         error: err,
    //         success: false
    //     })
    // })
});

module.exports = router;
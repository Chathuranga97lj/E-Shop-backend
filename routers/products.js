const {Product} = require('../models/product');
const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();
const mongoose = require('mongoose');

// http://localhost:3000/api/v1/....
// get date from db or storages (product list)
router.get(`/`, async (req, res) => {
    // in select() add only things must show, hide id using - mark
    // const productList = await Product.find().select('name image -_id');
    const productList = await Product.find();

    if(!productList){
        res.status(500).json({success: false})
    }
    res.send(productList);
});

// get product by id
router.get(`/:id`, async (req, res) => {
    const product = await Product.findById(req.params.id).populate('category');

    if(!product) {
        res.status(500).json({success: false})
    }
    res.send(product);
})


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


// update product
router.put('/:id', async (req, res) => {
    // validate product id
    if(!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Product ID');
    }

    // validate category
    const category = await Category.findById(req.body.category);
    if(!category) return res.status(400).send('Invalid Category');
    
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
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
        },
        {new: true} // for get updated data, else it returns old data after put request
    )
    if(!product) 
        return res.status(500).send('The product cannot be updated !');
    
    res.send(product);
})


// delete product
router.delete('/:id', (req, res) => {
    Product.findByIdAndRemove(req.params.id).then(product => {
        if(product) {
            return res.status(200).json({success: true, message: 'The product was deleted !'})
        } else {
            return res.status(200).json({success: false, message: 'The product is not funded !'})
        }
    }).catch(err => {
        return res.status(400).json({success: false, error: err})
    })
})

// get product count
router.get(`/get/count`, async (req, res) => {
    let productCount = await Product.countDocuments((count) => count)
    if(!productCount) {
        res.status(500).json({success: false})
    }
    res.send({
        count: productCount
    });
})

module.exports = router;
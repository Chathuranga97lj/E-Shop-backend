const {Product} = require('../models/product');
const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();
const mongoose = require('mongoose'); 
const multer = require('multer');

// upload file type extentions
const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

// upload images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const isValid = FILE_TYPE_MAP[file.mimetype];  
      let uploadError = new Error('Invalid image type');

      if(isValid){
        uploadError = null;
      }
      // for my linux pc
      cb(null, '/home/cj/Documents/My-work/api-server/api-server/public/uploads/');
    },
    filename: function (req, file, cb) {
       
      const fileName = file.originalname.split(' ').join('-');
      const extension = FILE_TYPE_MAP[file.mimetype];
      cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
  })
  
  const uploadOptions = multer({ storage: storage })


// http://localhost:3000/api/v1/....
// get date from db or storages (product list)
router.get(`/`, async (req, res) => {
    // in select() add only things must show, hide id using - mark
    // const productList = await Product.find().select('name image -_id');

    // localhost:3000/api/v1/products?categories=243435, 35353    
    let filter = {};
    if(req.query.categories){
        filter = {category:req.query.categories.split(',')}
    }
    const productList = await Product.find(filter).populate('category');

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
router.post(`/`, uploadOptions.single('image'), async (req, res) => {

    // validate category
    const category = await Category.findById(req.body.category);
    if(!category) return res.status(400).send('Invalid Category');

    const file = req.file;
    if(!file) return res.status(400).send('No image in the request');

    // image file name
    const fileName = req.file.filename;
    //const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    //console.log('Base Path: ', basePath);


    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: `${basePath}${fileName}`,
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
router.put('/:id',uploadOptions.single('image'), async (req, res) => {
    // validate product id
    if(!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Product ID');
    }

    // validate category
    const category = await Category.findById(req.body.category);
    if(!category) return res.status(400).send('Invalid Category');

    // check product for update
    const product = await Product.findById(req.params.id);
    if(!product) return res.status(400).send('Invalid Product');

    const file = req.file;
    let imagepath;

    if(file) {
        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        imagepath = `${basePath}${fileName}`;
    } else {
        imagepath = product.image;
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: imagepath,
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
    if(!updatedProduct) 
        return res.status(500).send('The product cannot be updated !');
    
    res.send(updatedProduct);
})


// delete product
router.delete('/:id', (req, res) => {
    Product.findByIdAndRemove(req.params.id).then(product => {
        if(product) {
            return res.status(200).json({success: true, message: 'The product was deleted !'})
        } else {
            return res.status(404).json({success: false, message: 'The product is not funded !'})
        }
    }).catch(err => {
        return res.status(500).json({success: false, error: err})
    })
})

// get product count
router.get('/get/count', async (req, res) => {
    const productCount = await Product.countDocuments();
    if(!productCount) {
        res.status(500).json({success: false})
    }
    res.send({
        productCount: productCount
    });
   
})

// get features
router.get('/get/featured/:count', async (req, res) => {
    // set only get 5 products
    const count = req.params.count ? req.params.count: 0;

    const products = await Product.find({isFeatured: true}).limit(+count);
    if(!products) {
        res.status(500).json({success: false})
    }
    res.send(products);
   
})

module.exports = router;
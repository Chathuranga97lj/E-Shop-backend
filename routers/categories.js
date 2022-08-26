const {Category} = require('../models/category');
const express = require('express');
const router = express.Router();

// set get requrest
router.get(`/`, async (req, res) => {
    const categoryList = await Category.find();

    if(!categoryList) {
        res.status(500).json({success: false})
    }
    res.status(200).send(categoryList);
})

// get category by ID
router.get('/:id', async(req, res) => {
    const category = await Category.findById(req.params.id);

    if(!category) {
        res.status(500).json({message: 'The category with the given ID was not funded!'})
    }
    res.status(200).send(category);
})

// set post request
router.post('/', async (req, res) => {
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    })
    category = await category.save();

    if(!category) 
        return res.status(404).send('The category cannot be created !');
    
    res.send(category);
})

module.exports = router;
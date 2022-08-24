const {Category} = require('../models/order');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res) => {
    const categoryList = await User.find();

    if(!categoryList) {
        res.status(500).json({success: false})
    }
    res.send(categoryList);
})

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
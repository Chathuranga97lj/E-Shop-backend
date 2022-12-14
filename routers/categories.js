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


// update category
// put always return old data when updated
router.put('/:id', async (req, res) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color,
        },
        {new: true} // for get updated data, else it returns old data after put request
    )
    if(!category) 
        return res.status(404).send('The category cannot be created !');
    
    res.send(category);
})


// set delete category
// id: url look like (api/v1/sdgf24)
router.delete('/:id', (req, res) => {
    Category.findByIdAndRemove(req.params.id).then(category => {
        if(category) {
            return res.status(200).json({success: true, message: 'The category was deleted !'})
        } else {
            return res.status(404).json({success: false, message: 'The category is not funded !'})
        }
    }).catch(err => {
        return res.status(500).json({success: false, error: err})
    })
})

module.exports = router;
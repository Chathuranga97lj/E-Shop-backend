const express = require('express');
const app = express();

require('dotenv/config');

const api = process.env.API_URL;

// for identify post reqest json file format (Middleware)
app.use(express.json());

// http://localhost:3000/api/v1/....
// get date from db or storages
app.get(`${api}/products`, (req, res) => {
    const product = {
        id: 1,
        name: 'hair dresser',
        image: 'some_url'
    }
    res.send(product);
});

// send data to frontend
app.post(`${api}/products`, (req, res) => {
    const newProduct = req.body;
    console.log(newProduct);
    res.send(newProduct);
});

app.listen(3000, () => {
    console.log('server is running http://localhost:3000');
})
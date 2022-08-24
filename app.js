const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv/config');

app.use(cors());
// http requests
app.options('*', cors());

// import routes
const categoriesRoutes = require('./routers/categories');
const productsRouter = require('./routers/products');
const usersRoutes = require('./routers/users');
const ordersRoutes = require('./routers/orders');


// import api url
const api = process.env.API_URL;

// for identify post reqest json file format (Middleware)
app.use(express.json());
app.use(morgan('tiny'));


// use api routers
app.use(`${api}/products`, productsRouter);


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
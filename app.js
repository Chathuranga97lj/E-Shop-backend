const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv/config');
const authJwt = require('./helpers/jwt');

app.use(cors());
// http requests
app.options('*', cors());

// for identify post reqest json file format (Middleware)
app.use(bodyParser.json());
// app.use(express.json());
app.use(morgan('tiny'));
// app.use(authJwt);
app.use(authJwt());

// import routes
const categoriesRoutes = require('./routers/categories');
const productsRouters = require('./routers/products');
const usersRoutes = require('./routers/users');
const ordersRoutes = require('./routers/orders');


// import api url
const api = process.env.API_URL;


// use api routers
app.use(`${api}/products`, productsRouters);
app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);


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
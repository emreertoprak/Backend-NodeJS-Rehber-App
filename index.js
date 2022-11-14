const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');
require('dotenv/config')
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');

const app = express()

app.use(cors());
app.options('*',cors());

// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(authJwt());
app.use(errorHandler);


const api = process.env.API_URL;

// routers
const router = require('./routes/productRouter.js')
app.use(`${api}`, router)


//port
const PORT = process.env.PORT || 8080

//server
app.listen(PORT, () => {
    console.log(`running on port ${PORT}`)
})
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('./router');
const dotenv = require('dotenv')
const {Client} = require('pg');
const cookieParser = require('cookie-parser');


dotenv.config() 
const app = express();
app.use(cookieParser());

const corsOptions = {
    origin: "*",
    credentials: true,
    optionSucessStatus: 200
};

app.use(cors(corsOptions));
app.use('/', router);


const client = new Client ({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_DATABASE_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})




client.connect((err) => {
    if (!err) {
        console.log("Connected to Database.");       
    }
    else {
        console.error('Error connecting to DB: ', err)
    }
}) 


const port = process.env.DB_PORT || 4000;
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
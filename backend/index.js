const express = require('express')
var bodyParser = require('body-parser')
// const login = require('./Login/login.js')
const log = require('./server.js')

// const bodyParser=require('body-parser');
const app = express()
const cors = require('cors')

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));
// app.use(bodyParser.json())

app.use(cors());

app.use('/log', log.router);

// app.use('/login', login.router);


app.listen(4000,(err)=>{
    if(!err){
        console.log("view the login page at 'http://localhost:4000/index'")
    }
});

var express = require('express');
var fileSystem = require('fs');
var mysql = require('mysql');
var bodyParser=require('body-parser');

var server = express();

server.use(express.static('.'));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended:true}));

const con = mysql.createConnection({
    host: 'HOST_IP',
    user: 'USER_NAME',
    password: 'PASSWORD',
    port: 3306
});

con.connect(function(err) {
    if (err){
        console.log("Could not connect to the database.");
        throw err;
    }
    console.log("Connected!");
});

server.get('/', function(req, res){
    res.sendFile('index.html', { root: 'html' });
});
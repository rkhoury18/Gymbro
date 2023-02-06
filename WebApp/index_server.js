var express = require('express');
var fileSystem = require('fs');
var mysql = require('mysql');
var bodyParser=require('body-parser');

var server = express();

server.use(express.static('.'));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended:true}));

// const con = mysql.createConnection({
//     host: '13.42.25.210', //changes frequently
//     user: 'jim',
//     password: 'andy23',
//     port: 3306
// });

// con.connect(function(err) {
//     if (err){
//         console.log("Could not connect to the database.");
//         throw err;
//     }
//     console.log("Connected!");
// });

server.get('/', function(req, res){
    res.sendFile('index.html', { root: 'html' });
});

server.post('/hello_world', function(req,res){
    let m = req.body
    let mssg = m.message
    console.log(mssg)
    let return_mssg = {}
    res.send()
})

console.log('Server is running on port 3000');
server.listen(3000,'0.0.0.0');
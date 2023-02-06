var express = require('express');
var fs = require('fs');
var mysql = require('mysql');
var bodyParser=require('body-parser');
var https=require('https');

var app = express();

app.use(express.static('FrontEnd'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true}));

//var privateKey  = fs.readFileSync('key.pem', 'utf8');
//var certificate = fs.readFileSync('cert.pem', 'utf8');
//var credentials = {key: privateKey, cert: certificate};

insert_sql = (data) => {
    let table = data.name
    str = "INSERT INTO " + table + "("
    for (var key in data) {
	if (key == "name") continue
        str += key + ", "
    }
    str = str.slice(0, -2) //remove last comma
    str += ") VALUES ("
    for (var key in data) {
	if (key == "name") continue
        str += data[key] + ", "
    }
    str = str.slice(0, -2) //remove last comma
    str += ");"
    return str
}

const con = mysql.createConnection({
    host: '13.40.222.118', //changes frequently
    user: 'jim',
    password: 'andy23',
    port: 3306
});

let start_exec; 
// {
//  name : "bench_press", //name of exercise    
//  start : 1, //0 = not started, 1 = started
//  reps : 10, //reps per set
//  sets : 4,  //number of sets
//  weight : 50, //weight in kgs 
//  rest : 60 //rest time in seconds
// }
let meta;
let workout;
let completed_set;

let db_name = "jimbro";

con.connect(function(err) {
    if (err){
        console.log("Could not connect to the database.");
        throw err;
    }
    console.log("Connected!");
});

con.query("USE "+db_name, function (err, result) {
    if (err) throw err;
});

app.get('/', function(req, res){
    res.sendFile('HTML/index.html', { root: 'FrontEnd' });
});

app.get('/use',function(req, res){
    res.sendFile('HTML/use.html', { root: 'FrontEnd' });
})

app.get('/workout',function(req, res){
    res.sendFile('HTML/workout.html', { root: 'FrontEnd' });
})

app.get('/history',function(req, res){
    res.sendFile('HTML/history.html', { root: 'FrontEnd' });
})

app.post('/history/save',function(req, res){
    let data = req.body
    console.log(JSON.stringify(data, null, 4))
    //store data in database
    res.end()
})

app.post('/pi', function(req,res){
    let m = req.body
    let mssg = m.message
    console.log(mssg)
    let reply = {"message":"i dont like pi:("}
    res.end(reply)
})

app.get('/client/start_exec', function(req,res){ //change to post
    //start_exec = req.body
    start_exec = {name:"bench_press", start:1, reps:5, sets:3, weight:50, rest:30}
    meta = {name:start_exec.name, start:start_exec.start, sets:start_exec.sets,rest:start_exec.rest}
    workout = {reps:start_exec.reps, weight:start_exec.weight}
    console.log(start_exec)
}) //get workout data from client

app.get('/pi/start_exec', function(req,res){
    res.send(meta)
    console.log("meta data :",meta)
}) //pi is constantly polling app here

app.get('/pi/start_set', function(req,res){
    res.send(workout)
    console.log("workout data :",workout)
}) //send pi workout data

app.post('/pi/finish_set', function(req,res){
    completed_set = req.body
    console.log("completed:",completed_set)
    res.end()
}) //get data at the end of set from pi

app.get('/client/finish_set', function(req,res){
    res.send(completed_set)
}) //send workout data to client

app.post('/pi/finish_exec', function(req,res){
    let finished_exec = req.body
    console.log("total exec:",finished_exec)
    req = insert_sql(finished_exec)
    con.query(req, function (err, result) {
        if (err) throw err;
    });
    res.end()
}) //get data at the end of exec from pi

//http code:
console.log('app is running on port 3000');
app.listen(3000,'0.0.0.0');

//https code:
// var httpsServer = https.createServer(credentials, app);
// httpsServer.listen(3000,'0.0.0.0',()=>{console.log('app is running on port 3000');})
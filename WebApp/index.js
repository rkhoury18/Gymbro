var express = require('express');
var fs = require('fs');
var mysql = require('mysql');
var bodyParser=require('body-parser');
var https=require('https');
const expressSession = require("express-session");
const passport = require("passport");
const Auth0Strategy = require("passport-auth0");
require("dotenv").config();
const authRouter = require("./auth");

const session = {
    secret: process.env.SESSION_SECRET,
    cookie: {},
    resave: false,
    saveUninitialized: false
  };

  const strategy = new Auth0Strategy(
    {
      domain: process.env.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      callbackURL: process.env.AUTH0_CALLBACK_URL
    },
    function(accessToken, refreshToken, extraParams, profile, done) {
      /**
       * Access tokens are used to authorize users to an API
       * (resource server)
       * accessToken is the token to call the Auth0 API
       * or a secured third-party API
       * extraParams.id_token has the JSON Web Token
       * profile has all the information from the user
       */
      return done(null, profile);
    }
  )

var app = express();

app.use(express.static('FrontEnd'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true}));
app.use(expressSession(session));
passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser((user, done) => {
    done(null, user);
  });
  
  passport.deserializeUser((user, done) => {
    done(null, user);
  });


//   app.use((req, res, next) => {
//     res.locals.isAuthenticated = req.isAuthenticated();
//     next();
//   });

app.use("/", authRouter);

var privateKey  = fs.readFileSync('key.pem', 'utf8');
var certificate = fs.readFileSync('cert.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};

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

insert_sql_link_wrkt = (data,fk_c,fk) => {
    let table = data.name
    str = "INSERT INTO " + table + "("
    for (var key in data) {
	    if (key == "name") continue
        str += key + ", "
    }
    str += fk_c+ ", "
    str = str.slice(0, -2) //remove last comma
    str += ") VALUES ("
    for (var key in data) {
	    if (key == "name") continue
        str += data[key] + ", "
    }
    str += "'" + fk + "', "
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
//  reps : 10, //reps per set
//  sets : 4,  //number of sets
//  weight : 50, //weight in kgs 
//  rest : 60 //rest time in seconds
// }

var workout = {}
var meta;
var workout_change_my_name;
var completed_set;

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
    console.log(req.user)
    res.sendFile('index.html', { root: 'FrontEnd/HTML' });
});

app.get('/login_for_andy', function(req, res){
    res.sendFile('hellpage.html', { root: 'FrontEnd/HTML' });
});

app.get('/use',function(req, res){
    res.sendFile('use.html', { root: 'FrontEnd/HTML' });
})

app.get('/workout',function(req, res){
    res.sendFile('workout.html', { root: 'FrontEnd/HTML' });
})

app.get('/history',function(req, res){
    res.sendFile('history.html', { root: 'FrontEnd/HTML' });
})

app.get('/new_workout',function(req, res){
    res.sendFile('CreateNewWorkout.html', { root: 'FrontEnd/HTML' });
})

app.get('/start_workout',function(req, res){
    console.log(workout)
    res.sendFile('StartWorkout.html', { root: 'FrontEnd/HTML' });
})

app.post('/history/save',function(req, res){
    let data = req.body
    console.log(JSON.stringify(data, null, 4))
    //store data in database
    let str_wrkt = "INSERT INTO workouts("
    for (var key in data) {
        str_wrkt += key + ", "
    }
    str_wrkt = str_wrkt.slice(0, -2) //remove last comma
    str_wrkt += ") VALUES ("
    for (var key in data) {
        if (key == "name") {
            str_wrkt += "'" + data[key] + "', "
        }
        else {
            str_wrkt += "'" + data[key].name + "', "
        }
    }
    str_wrkt = str_wrkt.slice(0, -2) //remove last comma
    str_wrkt += ");"
    req_workouts = str_wrkt
    con.query(req_workouts, function (err, result) {
        if (err) throw err;
    });
    for (var key in data) {
        if (key == "name") continue
        let str_ex = insert_sql_link_wrkt(data[key],"workout",data.name)
        con.query(str_ex, function (err, result) {
            if (err) throw err;
        });
    }
    res.end()
})

app.get('/rcv/workout_names', function(req,res){
    let q = "SELECT name FROM workouts"
    con.query(q, function (err, result) {
        if (err) throw err;
        r = JSON.parse(JSON.stringify(result));
        console.log(r)
        res.send(r)
    })
})

app.get('/rcv/workout', function(req,res){
    res.send(workout)
})

app.post('/pi', function(req,res){
    let m = req.body
    let mssg = m.message
    console.log(mssg)
    let reply = {"message":"i dont like pi:("}
    res.end(reply)
})

app.post('/client/workout/start', function(req,res){
    let data = req.body;
    workout_name = data.name
    console.log(data)
    base_q = "SELECT * FROM workouts WHERE name = '" + workout_name + "';" //get exercises in workout
    console.log(base_q)
    workout = {}
    con.query(base_q, function (err, result) {
        console.log("hello?")
        if (err) throw err;
        r = JSON.parse(JSON.stringify(result))[0];
        console.log(r)
        for (var key in r){
            if (key == "name") continue
            if (r[key] == null) continue
            let q = "SELECT * FROM " + r[key] + " WHERE workout = '" + r.name + "';" //get exercise data
            let k = r[key]
            con.query(q, function (err, result) {
                console.log("hello???")
                if (err) throw err;
                r_2 = JSON.parse(JSON.stringify(result))[0];
                console.log(k)
                console.log(r_2)
                workout[k] = r_2
            })
        }
    })
})
app.post('/client/start_ex', function(req,res){ //change to post
    ex = req.body
    ex["start"] = 1
    meta = {name:ex.name, start:ex.start, sets:ex.sets,rest:ex.rest}
    workout_change_my_name = {reps:ex.reps, weight:ex.weight}
    console.log(ex)
}) //get workout data from client

app.get('/pi/start_exec', function(req,res){
    res.send(meta)
    console.log("meta data :",meta)
}) //pi is constantly polling app here

app.get('/pi/start_set', function(req,res){
    res.send(workout_change_my_name)
    console.log("workout data :",workout_change_my_name)
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

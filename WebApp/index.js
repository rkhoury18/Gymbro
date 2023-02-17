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

insert_sql_workout = (data) => {
    let str_wrkt = "INSERT INTO workouts("
    for (var key in data) {
        str_wrkt += key + ", "
    }
    str_wrkt = str_wrkt.slice(0, -2) //remove last comma
    str_wrkt += ") VALUES ("
    for (var key in data) {
        if (key == "name" || key == "user_id") {
            str_wrkt += "'" + data[key] + "', "
        }
        else {
            str_wrkt += "'" + data[key].name + "', "
        }
    }
    str_wrkt = str_wrkt.slice(0, -2) //remove last comma
    str_wrkt += ");"
    return str_wrkt
}

const con = mysql.createConnection({
    host: '13.42.105.65', //changes frequently
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

var workout = {};
var workout_data = {};
var meta;
var ex_history_name;
let ex_data = {};
var completed_set ={};
var curr_workout_name;
var user_pi = {}
//var user_home = {}
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
    console.log(req.isAuthenticated())
    let user = {}
    if (req.isAuthenticated()) {
        console.log(req.user)
        user["name"] = req.user.displayName
        user["email"] = req.user.email
        user["id"] = req.user.id.slice(14)
        res.sendFile('index.html', { root: 'FrontEnd/HTML'});
    } else {
        res.sendFile("login.html", { root: "FrontEnd/HTML"});
    }
});

app.get('/rcv/user', function(req, res){
    let user = {}
    user["name"] = req.user.displayName
    user["email"] = req.user.email
    user["id"] = req.user.id.slice(14)
    console.log(user)
    res.send(user);
});

app.get('/use',function(req, res){
    if (!req.isAuthenticated()){
        res.redirect("/")
    }
    else{
        res.sendFile('use.html', { root: 'FrontEnd/HTML' });
    }
})

app.get('/workout',function(req, res){
    if (!req.isAuthenticated()){
        res.redirect("/")
    }
    else{
        res.sendFile('workout.html', { root: 'FrontEnd/HTML' });
    }
})

app.get('/modify_workout',function(req, res){
    if (!req.isAuthenticated()){
        res.redirect("/")
    }
    else{
        res.sendFile('modify_krish.html', { root: 'FrontEnd/HTML' });
    }
})

app.get('/history',function(req, res){
    if (!req.isAuthenticated()){
        res.redirect("/")
    }
    else{
        let user = {}
        user["name"] = req.user.name
        user["email"] = req.user.email
        user["id"] = req.user.id.slice(14)
        base_q = "SELECT name FROM workouts WHERE user_id = '" + user.id + "';" //get names of exercises in workout
        console.log(base_q)
        con.query(base_q, function (err, result) {
            if (err) throw err;
            for (var i of result) {
                console.log()
                let workout_name = i.name
                console.log(workout_name)
                q = "SELECT COUNT(*) FROM history WHERE name = '" + workout_name + "' AND user_id = '" + user.id + "';"
                con.query(q, function (err, result) {
                    if (err) throw err;
                    r = JSON.parse(JSON.stringify(result))[0]
                    workout_data[workout_name] = r["COUNT(*)"]
                    //console.log(workout_data)
                })
            }
    
        })
        res.sendFile('history.html', { root: 'FrontEnd/HTML' });
    }
})

app.get('/new_workout',function(req, res){
    if (!req.isAuthenticated()){
        res.redirect("/")
    }
    else{
    res.sendFile('CreateNewWorkout.html', { root: 'FrontEnd/HTML' });
    }
})

app.get('/start_workout',function(req, res){
    console.log(workout)
    if (!req.isAuthenticated()){
        res.redirect("/")
    }
    else{
	user_pi["name"] = req.user.name
	user_pi["email"] = req.user.email
	user_pi["id"] = req.user.id.slice(14)
        res.sendFile('StartWorkout.html', { root: 'FrontEnd/HTML' });
    }
})
    
app.post('/history/save',function(req, res){
    let user = {}
    user["name"] = req.user.name
    user["email"] = req.user.email
    user["id"] = req.user.id.slice(14)
    let data = req.body
    console.log(JSON.stringify(data, null, 4))
    //store data in database
    data["user_id"] = user.id
    let str_wrkt = "INSERT INTO workouts("
    for (var key in data) {
        str_wrkt += key + ", "
    }
    str_wrkt = str_wrkt.slice(0, -2) //remove last comma
    str_wrkt += ") VALUES ("
    for (var key in data) {
        if (key == "name" || key == "user_id") {
            str_wrkt += "'" + data[key] + "', "
        }
        else {
            str_wrkt += "'" + data[key].name + "', "
        }
    }
    str_wrkt = str_wrkt.slice(0, -2) //remove last comma
    str_wrkt += ");"
    req_workouts = str_wrkt
    console.log(req_workouts)
    con.query(req_workouts, function (err, result) {
        if (err) throw err;
    });
    for (var key in data) {
        if (key == "name") continue
	    if (key == "user_id") continue
        data[key]["user_id"] = user.id
        let str_ex = insert_sql_link_wrkt(data[key],"workout",data.name)
        con.query(str_ex, function (err, result) {
            if (err) throw err;
        });
    }
    res.end()
})

app.post('/history/modify',function(req, res){
    let user = {}
    user["name"] = req.user.name
    user["email"] = req.user.email
    user["id"] = req.user.id.slice(14)
    let data = req.body
    data["user_id"] = user.id
    let wrkt_name = data.name
    base_q = "SELECT * FROM workouts WHERE name = '" + wrkt_name + "' AND user_id = '" + user.id + "';" //get exercises in workout
    workout = {}
    con.query(base_q, function (err, result) {
        if (err) throw err;
        r = JSON.parse(JSON.stringify(result))[0];
        for (var key in r){
            if (key == "name") continue
            if (r[key] == null) continue
	        if (key == "user_id") continue
            let q = "DELETE FROM " + r[key] + " WHERE workout = '" + r.name + "' AND user_id = '" + user.id + "';" //delete exercise data
            console.log(q)
            con.query(q, function (err, result) {
                if (err) throw err;
            })
        }
        let q = "DELETE FROM workouts WHERE name = '" + r.name + "' AND user_id = '" + user.id + "';" //delete workout data
        console.log(q)
        con.query(q, function (err, result) {
            if (err) throw err;
            let str_wrkt = "INSERT INTO workouts("
            for (var key in data) {
                str_wrkt += key + ", "
            }
            str_wrkt = str_wrkt.slice(0, -2) //remove last comma
            str_wrkt += ") VALUES ("
            for (var key in data) {
                if (key == "name" || key == "user_id") {
                    str_wrkt += "'" + data[key] + "', "
                }
                else {
                    str_wrkt += "'" + data[key].name + "', "
                }
            }
            str_wrkt = str_wrkt.slice(0, -2) //remove last comma
            str_wrkt += ");"
            req_workouts = str_wrkt
            console.log(req_workouts)
            con.query(req_workouts, function (err, result) {
                if (err) throw err;
            });
            for (var key in data) {
                if (key == "name") continue
                if (key == "user_id") continue
                data[key]["user_id"] = user.id
                let str_ex = insert_sql_link_wrkt(data[key],"workout",data.name)
                con.query(str_ex, function (err, result) {
                    if (err) throw err;
                });
            }
            res.end()
        })
    })
})
app.get('/rcv/workout_names', function(req,res){
    let user = {}
    user["name"] = req.user.name
    user["email"] = req.user.email
    user["id"] = req.user.id.slice(14)
    let q = "SELECT name FROM workouts WHERE user_id = '" + user.id + "';"
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
    let user ={}
    user["name"] = req.user.name
    user["email"] = req.user.email
    user["id"] = req.user.id.slice(14)
    curr_workout_name = data.name
    console.log(data)
    base_q = "SELECT * FROM workouts WHERE name = '" + curr_workout_name + "' AND user_id = '" + user.id + "';" //get exercises in workout
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
	        if (key == "user_id") continue
            let q = "SELECT * FROM " + r[key] + " WHERE workout = '" + r.name + "' AND user_id = '" + user.id + "';" //get exercise data
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
    set = {reps:ex.reps, weight:ex.weight}
    console.log(ex)
}) //get workout data from client

app.post('/client/workout/delete', function(req,res){
    let data = req.body
    let user = {}
    user["name"] = req.user.name
    user["email"] = req.user.email
    user["id"] = req.user.id.slice(14)
    console.log(data)
    workout_name = data.name
    base_q = "SELECT * FROM workouts WHERE name = '" + workout_name + "' AND user_id = '" + user.id + "';" //get exercises in workout
    workout = {}
    con.query(base_q, function (err, result) {
        if (err) throw err;
        r = JSON.parse(JSON.stringify(result))[0];
        for (var key in r){
            if (key == "name") continue
            if (r[key] == null) continue
	        if (key == "user_id") continue
            let q = "DELETE FROM " + r[key] + " WHERE workout = '" + r.name + "' AND user_id = '" + user.id + "';" //delete exercise data
            console.log(q)
            con.query(q, function (err, result) {
                if (err) throw err;
            })
        }
        let q = "DELETE FROM workouts WHERE name = '" + r.name + "' AND user_id = '" + user.id + "';" //delete workout data
        console.log(q)
        con.query(q, function (err, result) {
            if (err) throw err;
        })
    })
} )

app.post('/client/workout/finish', function(req,res){
    let data = req.body
    let user = {}
    user["name"] = req.user.name
    user["email"] = req.user.email
    user["id"] = req.user.id.slice(14)
    console.log(data) 
    if (data.finish){
        workout = {}
        let q = "INSERT INTO history (name, user_id) VALUES ('" + curr_workout_name + "', '" + user.id + "');" //add workout to history
	console.log(q)
        con.query(q, function (err, result) {
            if (err) throw err;
        })
    }
    res.end()
})

app.get('/pi/start_exec', function(req,res){
    res.send(meta)
    console.log("meta data :",meta)
}) //pi is constantly polling app here

app.get('/pi/start_set', function(req,res){
    res.send(set)
    console.log("set data :",set)
}) //send pi set data

app.post('/pi/finish_set', function(req,res){
    completed_set = req.body
    console.log("completed:",completed_set)
    res.end()
}) //get data at the end of set from pi

app.get('/client/finish_set', function(req,res){
    res.send(completed_set)
    completed_set = {}
}) //send workout data to client

app.post('/pi/finish_exec', function(req,res){
    let finished_exec = req.body
    finished_exec["user_id"] = user_pi.id
    console.log("total exec:",finished_exec)
    req = insert_sql(finished_exec)
    con.query(req, function (err, result) {
        if (err) throw err;
    });
    meta = {}
    set= {}
    res.end()
}) //get data at the end of exec from pi

app.get('/client/finish_exec', function(req,res){
    res.send("done")
}) //send ex complete to client

app.post('/history/ex', function(req,res){
    let data = req.body
    ex_history_name = data.name
    console.log(ex_history_name)
})

app.get('/history/rcv/ex', function(req,res){
    let user = {}
    user["name"] = req.user.name
    user["email"] = req.user.email
    user["id"] = req.user.id.slice(14)
    let q = "SELECT weight,reps,volume,completed FROM " + ex_history_name + " WHERE user_id = '" + user.id + "';"
    con.query(q, function (err, result) {
        if (err) throw err;
        let r = JSON.parse(JSON.stringify(result))
        ex_data["ex_history"] = r
        let q_2 = "SELECT weight, reps FROM " + ex_history_name + " WHERE user_id = '" + user.id + "' AND weight = (SELECT MAX(weight) FROM bench_press WHERE user_id = '" + user.id + "') ORDER BY reps DESC LIMIT 1"
        console.log(q_2)
        con.query(q_2, function (err, result) {
            if (err) throw err;
            let r2 = JSON.parse(JSON.stringify(result))[0]
            ex_data["max_weight"] = r2
            let q_3 = "SELECT MAX(volume) FROM " + ex_history_name + " WHERE user_id = '" + user.id + "';"
            con.query(q_3, function (err, result) {
                if (err) throw err;
                let r3 = JSON.parse(JSON.stringify(result))[0]
                ex_data["max_volume"] = r3
                console.log("sending: ",ex_data)
                res.send(ex_data)
            })
        })
    })
})

app.get('/history/rcv/workout', function(req,res){
    let user = {}
    user["name"] = req.user.name
    user["email"] = req.user.email
    user["id"] = req.user.id.slice(14)
    base_q = "SELECT name FROM workouts WHERE user_id = '" + user.id + "';" //get names of exercises in workout
    console.log(base_q)
    con.query(base_q, function (err, result) {
        if (err) throw err;
    
        let completedQueries = 0;
        let totalQueries = result.length;
        let workout_data = {};
    
        for (var i of result) {
            let workout_name = i.name
            let q = "SELECT COUNT(*) FROM history WHERE name = '" + workout_name + "' AND user_id = '" + user.id + "';"
            con.query(q, function (err, result) {
                if (err) throw err;
    
                r = JSON.parse(JSON.stringify(result))[0];
                workout_data[workout_name] = r["COUNT(*)"];
    
                // Increment the completed queries counter
                completedQueries++;
    
                // Check if all queries have completed
                if (completedQueries === totalQueries) {
                    res.send(workout_data);
                }
            });
        }
    });
})

app.get('/fill/data/rhea',function(req,res){
    let id = req.user.id.slice(14)
    delete_sql = (table) => {
        return "DELETE FROM " + table + " WHERE user_id = '" + user.id + "';"
    }
    for(let t of ["bench_press","squat","deadlift","overhead_press","hip_thrust","barbell_row","p_bench_press","p_squat","p_deadlift","p_overhead_press","p_hip_thrust","p_barbell_row","workouts","history"]){
        let q = delete_sql(t)
        con.query(q, function (err, result) {
            if (err) throw err;
        })
    }
    fill_data = (ex_name,id,date_completed,weight,reps) => {
        let d = {name:ex_name,user_id:id,weight:weight,reps:reps,sets:3,volume:weight*reps,completed:date_completed}
        let query_d = insert_sql(d)
        con.query(query_d,function(err,result){
            if (err) throw err;
        })
    }
    fill_workout = (workout,exec1,exec2,exec3,id) => {
        let w = {name:workout,user_id:id,exec1:exec1,exec2:exec2,exec3:exec3}
        let query_w = insert_sql_workout(w)
        con.query(query_w,function(err,result){
            if (err) throw err;
        })
        for( e of [exec1,exec2,exec3]){
                console.log(e)
                e["user_id"] = id
                query_ex = insert_sql_link_wrkt(e,"workout",workout)
                console.log(query_ex)
                con.query(query_ex,function(err,result){
                    if (err) throw err;
                })
            }
        }
    let push = {name:"push",
                exec1:{name:"p_bench_press",weight:80,reps:10,sets:3,rest:60},
                exec2:{name:"p_overhead_press",weight:50,reps:10,sets:3,rest:60}
                }
    let pull = {name:"pull",
                exec1:{name:"p_barbell_row",weight:80,reps:10,sets:3,rest:60},
                exec2:{name:"p_deadlift",weight:160,reps:5,sets:3,rest:60}
                }
    let legs = {name:"legs",
                exec1:{name:"p_squat",weight:120,reps:10,sets:3,rest:60},
                exec2:{name:"p_hip_thrust",weight:80,reps:10,sets:3,rest:60}
                }
    let upper = {name:"upper",
                exec1:{name:"p_bench_press",weight:80,reps:10,sets:3,rest:60},
                exec2:{name:"p_overhead_press",weight:50,reps:10,sets:3,rest:60},
                exec3:{name:"p_barbell_row",weight:80,reps:10,sets:3,rest:60}
                }
    let lower = {name:"lower",
                exec1:{name:"p_squat",weight:120,reps:10,sets:3,rest:60},
                exec2:{name:"p_hip_thrust",weight:80,reps:10,sets:3,rest:60},
                exec3:{name:"p_deadlift",weight:160,reps:5,sets:3,rest:60}
                }
    let full_body_a =   {name:"full_body_a",
                        exec1:{name:"p_bench_press",weight:80,reps:10,sets:3,rest:60},
                        exec2:{name:"barbell_row",weight:80,reps:10,sets:3,rest:60},
                        exec3:{name:"p_squat",weight:120,reps:10,sets:3,rest:60},
                        }
    let full_body_b =   {name:"full_body_b",
                        exec1:{name:"p_overhead_press",weight:50,reps:10,sets:3,rest:60},
                        exec2:{name:"p_deadlift",weight:160,reps:5,sets:3,rest:60},
                        exec3:{name:"p_hip_thrust",weight:80,reps:10,sets:3,rest:60},
                        }
    let dates = ["2023-01-01 03:23:45","2023-01-08 03:23:45","2023-01-15 03:23:45","2023-01-22 03:23:45","2023-01-29 03:23:45","2023-02-05 03:23:45","2023-02-12 01-23-45","2023-02-19 03:23:45","2023-02-26 03:23:45","2023-03-05 03:23:45","2023-03-12 03:23:45","2023-03-19 03:23:45","2023-03-26 03:23:45","2023-04-02 03:23:45","2023-04-09 03:23:45","2023-04-16 03:23:45","2023-04-23 03:23:45","2023-04-30 03:23:45"]//,"2023-05-07 01:23:45","2023-05-14 01:23:45","2023-05-21 01:23:45","2023-05-28 01:23:45","2023-06-04 01:23:45","2023-06-11 01:23:45","2023-06-18 01:23:45","2023-06-25 01:23:45","2023-07-02 01:23:45","2023-07-09 01:23:45","2023-07-16 01:23:45","2023-07-23 01:23:45","2023-07-30 01:23:45","2023-08-06 01:23:45","2023-08-13 01:23:45","2023-08-20 01:23:45","2023-08-27 01:23:45","2023-09-03 01:23:45","2023-09-10 01:23:45","2023-09-17 01:23:45","2023-09-24 01:23:45","2023-10-01 01:23:45","2023-10-08 01:23:45","2023-10-15 01:23:45","2023-10-22 01:23:45","2023-10-29 01:23:45","2023-11-05 01:23:45","202"]
    for (let ex of ["bench_press","overhead_press","deadlift","barbell_row","squat","hip_thrust"]) {
        let i = 0
        for (let weight of [67,70,82]){
            let rep_arr = []
            if (weight == 67) {
                rep_arr = [10]
            }
            else if (weight == 82) {
                rep_arr = [8,10]
            }
            else {
                rep_arr = [6,8]
            }
            for (let reps of rep_arr){
                fill_data(ex,id,"'"+dates[i]+"'",weight,reps)
                i+=1
            }
        }      
    }
    for (let wrk of [upper,lower]) {
        fill_workout(wrk.name,wrk.exec1,wrk.exec2,wrk.exec3,id)
    }
    insert_h  = (data) => {
        str = "INSERT INTO history ("
        for (var key in data) {
            str += key + ", "
        }
        str = str.slice(0, -2) //remove last comma
        str += ") VALUES ("
        for (var key in data) {
            str += data[key] + ", "
        }
        str = str.slice(0, -2) //remove last comma
        str += ");"
        con.query(str, function (err, result) {
            if (err) throw err;
        })
    }
    for (let i = 0; i < 8; i++) {
        data = {name:"'upper'",user_id:id,date_completed:"'"+dates[i]+"'"}
        insert_h(data);
    }
    for (let i = 0; i < 10; i++) {
        data = {name:"'lower'",user_id:id,date_completed:"'"+dates[i]+"'"}
        insert_h(data);
    }
})

app.get('/fill/data/krish', function(req, res) {
    let id = req.user.id.slice(14)
    delete_sql = (table) => {
        return "DELETE FROM " + table + " WHERE user_id = '" + user.id + "';"
    }
    for(let t of ["bench_press","squat","deadlift","overhead_press","hip_thrust","barbell_row","p_bench_press","p_squat","p_deadlift","p_overhead_press","p_hip_thrust","p_barbell_row","workouts","history"]){
        let q = delete_sql(t)
        con.query(q, function (err, result) {
            if (err) throw err;
        })
    }
    fill_data = (ex_name,id,date_completed,weight,reps) => {
        let d = {name:ex_name,user_id:id,weight:weight,reps:reps,sets:3,volume:weight*reps,completed:date_completed}
        let query_d = insert_sql(d)
        con.query(query_d,function(err,result){
            if (err) throw err;
        })
    }
    fill_workout = (workout,exec1,exec2,exec3,id) => {
        let w = {name:workout,user_id:id,exec1:exec1,exec2:exec2,exec3:exec3}
        let query_w = insert_sql_workout(w)
        con.query(query_w,function(err,result){
            if (err) throw err;
        })
        for( e of [exec1,exec2,exec3]){
                console.log(e)
                e["user_id"] = id
                query_ex = insert_sql_link_wrkt(e,"workout",workout)
                console.log(query_ex)
                con.query(query_ex,function(err,result){
                    if (err) throw err;
                })
            }
        }
    let push = {name:"push",
                exec1:{name:"p_bench_press",weight:80,reps:10,sets:3,rest:60},
                exec2:{name:"p_overhead_press",weight:50,reps:10,sets:3,rest:60}
                }
    let pull = {name:"pull",
                exec1:{name:"p_barbell_row",weight:80,reps:10,sets:3,rest:60},
                exec2:{name:"p_deadlift",weight:160,reps:5,sets:3,rest:60}
                }
    let legs = {name:"legs",
                exec1:{name:"p_squat",weight:120,reps:10,sets:3,rest:60},
                exec2:{name:"p_hip_thrust",weight:80,reps:10,sets:3,rest:60}
                }
    let upper = {name:"upper",
                exec1:{name:"p_bench_press",weight:80,reps:10,sets:3,rest:60},
                exec2:{name:"p_overhead_press",weight:50,reps:10,sets:3,rest:60},
                exec3:{name:"p_barbell_row",weight:80,reps:10,sets:3,rest:60}
                }
    let lower = {name:"lower",
                exec1:{name:"p_squat",weight:120,reps:10,sets:3,rest:60},
                exec2:{name:"p_hip_thrust",weight:80,reps:10,sets:3,rest:60},
                exec3:{name:"p_deadlift",weight:160,reps:5,sets:3,rest:60}
                }
    let full_body_a =   {name:"Full Body A",
                        exec1:{name:"p_bench_press",weight:80,reps:10,sets:3,rest:60},
                        exec2:{name:"p_barbell_row",weight:80,reps:10,sets:3,rest:60},
                        exec3:{name:"p_squat",weight:120,reps:10,sets:3,rest:60},
                        }
    let full_body_b =   {name:"Full Body B",
                        exec1:{name:"p_overhead_press",weight:50,reps:10,sets:3,rest:60},
                        exec2:{name:"p_deadlift",weight:160,reps:5,sets:3,rest:60},
                        exec3:{name:"p_hip_thrust",weight:80,reps:10,sets:3,rest:60},
                        }
    let dates = ["2023-01-01 02:23:45","2023-01-08 02:23:45","2023-01-15 02:23:45","2023-01-22 02:23:45","2023-01-29 02:23:45","2023-02-05 02:23:45","2023-02-12 01-23-45","2023-02-19 02:23:45","2023-02-26 02:23:45","2023-03-05 02:23:45","2023-03-12 02:23:45","2023-03-19 02:23:45","2023-03-26 02:23:45","2023-04-02 02:23:45","2023-04-09 02:23:45","2023-04-16 02:23:45","2023-04-23 02:23:45","2023-04-30 02:23:45"]//,"2023-05-07 02:23:45","2023-05-14 01:23:45","2023-05-21 01:23:45","2023-05-28 01:23:45","2023-06-04 01:23:45","2023-06-11 01:23:45","2023-06-18 01:23:45","2023-06-25 01:23:45","2023-07-02 01:23:45","2023-07-09 01:23:45","2023-07-16 01:23:45","2023-07-23 01:23:45","2023-07-30 01:23:45","2023-08-06 01:23:45","2023-08-13 01:23:45","2023-08-20 01:23:45","2023-08-27 01:23:45","2023-09-03 01:23:45","2023-09-10 01:23:45","2023-09-17 01:23:45","2023-09-24 01:23:45","2023-10-01 01:23:45","2023-10-08 01:23:45","2023-10-15 01:23:45","2023-10-22 01:23:45","2023-10-29 01:23:45","2023-11-05 01:23:45","202"]
    for (let ex of ["bench_press","overhead_press","deadlift","barbell_row","squat","hip_thrust"]) {
        let i = 0
        for (let weight of [95,97,100]){
            let rep_arr = []
            if (weight == 95) {
                rep_arr = [8,10]
            }
            else if (weight == 82) {
                rep_arr = [10]
            }
            else {
                rep_arr = [6,8,10]
            }
            for (let reps of rep_arr){
                fill_data(ex,id,"'"+dates[i]+"'",weight,reps)
                i+=1
            }
        }      
    }
    for (let wrk of [full_body_a,full_body_b]) {
        fill_workout(wrk.name,wrk.exec1,wrk.exec2,wrk.exec3,id)
    }
    insert_h  = (data) => {
        str = "INSERT INTO history ("
        for (var key in data) {
            str += key + ", "
        }
        str = str.slice(0, -2) //remove last comma
        str += ") VALUES ("
        for (var key in data) {
            str += data[key] + ", "
        }
        str = str.slice(0, -2) //remove last comma
        str += ");"
        con.query(str, function (err, result) {
            if (err) throw err;
        })
    }
    for (let i = 0; i < 8; i++) {
        data = {name:"'Full Body A'",user_id:id,date_completed:"'"+dates[i]+"'"}
        insert_h(data);
    }
    for (let i = 0; i < 10; i++) {
        data = {name:"'Full Body B'",user_id:id,date_completed:"'"+dates[i]+"'"}
        insert_h(data);
    }
})

app.get('/fill/data/andy', (req, res) => {
    let id = req.user.id.slice(14)
    delete_sql = (table) => {
        return "DELETE FROM " + table + " WHERE user_id = '" + user.id + "';"
    }
    for(let t of ["bench_press","squat","deadlift","overhead_press","hip_thrust","barbell_row","p_bench_press","p_squat","p_deadlift","p_overhead_press","p_hip_thrust","p_barbell_row","workouts","history"]){
        let q = delete_sql(t)
        con.query(q, function (err, result) {
            if (err) throw err;
        })
    }
    fill_data = (ex_name,id,date_completed,weight,reps) => {
        let d = {name:ex_name,user_id:id,weight:weight,reps:reps,sets:3,volume:weight*reps,completed:date_completed}
        let query_d = insert_sql(d)
        con.query(query_d,function(err,result){
            if (err) throw err;
        })
    }
    fill_workout = (workout,exec1,exec2,id) => {
        let w = {name:workout,user_id:id,exec1:exec1,exec2:exec2}
        let query_w = insert_sql_workout(w)
        con.query(query_w,function(err,result){
            if (err) throw err;
        })
        for( e of [exec1,exec2]){
                console.log(e)
                e["user_id"] = id
                query_ex = insert_sql_link_wrkt(e,"workout",workout)
                console.log(query_ex)
                con.query(query_ex,function(err,result){
                    if (err) throw err;
                })
            }
        }
    let push = {name:"push",
                exec1:{name:"p_bench_press",weight:80,reps:10,sets:3,rest:60},
                exec2:{name:"p_overhead_press",weight:50,reps:10,sets:3,rest:60}
                }
    let pull = {name:"pull",
                exec1:{name:"p_barbell_row",weight:80,reps:10,sets:3,rest:60},
                exec2:{name:"p_deadlift",weight:160,reps:5,sets:3,rest:60}
                }
    let legs = {name:"legs",
                exec1:{name:"p_squat",weight:120,reps:10,sets:3,rest:60},
                exec2:{name:"p_hip_thrust",weight:80,reps:10,sets:3,rest:60}
                }
    let upper = {name:"upper",
                exec1:{name:"p_bench_press",weight:80,reps:10,sets:3,rest:60},
                exec2:{name:"p_overhead_press",weight:50,reps:10,sets:3,rest:60},
                exec3:{name:"p_barbell_row",weight:80,reps:10,sets:3,rest:60}
                }
    let lower = {name:"lower",
                exec1:{name:"p_squat",weight:120,reps:10,sets:3,rest:60},
                exec2:{name:"p_hip_thrust",weight:80,reps:10,sets:3,rest:60},
                exec3:{name:"p_deadlift",weight:160,reps:5,sets:3,rest:60}
                }
    let full_body_a =   {name:"full_body_a",
                        exec1:{name:"p_bench_press",weight:80,reps:10,sets:3,rest:60},
                        exec2:{name:"barbell_row",weight:80,reps:10,sets:3,rest:60},
                        exec3:{name:"p_squat",weight:120,reps:10,sets:3,rest:60},
                        }
    let full_body_b =   {name:"full_body_b",
                        exec1:{name:"p_overhead_press",weight:50,reps:10,sets:3,rest:60},
                        exec2:{name:"p_deadlift",weight:160,reps:5,sets:3,rest:60},
                        exec3:{name:"p_hip_thrust",weight:80,reps:10,sets:3,rest:60},
                        }
    let dates = ["2023-01-01 01:23:45","2023-01-08 01:23:45","2023-01-15 01:23:45","2023-01-22 01:23:45","2023-01-29 01:23:45","2023-02-05 01:23:45","2023-02-12 01-23-45","2023-02-19 01:23:45","2023-02-26 01:23:45","2023-03-05 01:23:45","2023-03-12 01:23:45","2023-03-19 01:23:45","2023-03-26 01:23:45","2023-04-02 01:23:45","2023-04-09 01:23:45","2023-04-16 01:23:45","2023-04-23 01:23:45","2023-04-30 01:23:45"]//,"2023-05-07 01:23:45","2023-05-14 01:23:45","2023-05-21 01:23:45","2023-05-28 01:23:45","2023-06-04 01:23:45","2023-06-11 01:23:45","2023-06-18 01:23:45","2023-06-25 01:23:45","2023-07-02 01:23:45","2023-07-09 01:23:45","2023-07-16 01:23:45","2023-07-23 01:23:45","2023-07-30 01:23:45","2023-08-06 01:23:45","2023-08-13 01:23:45","2023-08-20 01:23:45","2023-08-27 01:23:45","2023-09-03 01:23:45","2023-09-10 01:23:45","2023-09-17 01:23:45","2023-09-24 01:23:45","2023-10-01 01:23:45","2023-10-08 01:23:45","2023-10-15 01:23:45","2023-10-22 01:23:45","2023-10-29 01:23:45","2023-11-05 01:23:45","202"]
    for (let ex of ["bench_press","overhead_press","deadlift","barbell_row","squat","hip_thrust"]) {
        let i = 0
        for (let weight of [72.5,75,80]){
            let rep_arr = []
            if (weight == 72.5) {
                rep_arr = [6,8]
            }
            else if (weight == 75) {
                rep_arr = [6,8,10]
            }
            else {
                rep_arr = [6]
            }
            for (let reps of rep_arr){
                fill_data(ex,id,"'"+dates[i]+"'",weight,reps)
                i+=1
            }
        }      
    }
    for (let wrk of [push,pull,legs]) {
        fill_workout(wrk.name,wrk.exec1,wrk.exec2,id)
    }
    insert_h  = (data) => {
        str = "INSERT INTO history ("
        for (var key in data) {
            str += key + ", "
        }
        str = str.slice(0, -2) //remove last comma
        str += ") VALUES ("
        for (var key in data) {
            str += data[key] + ", "
        }
        str = str.slice(0, -2) //remove last comma
        str += ");"
        con.query(str, function (err, result) {
            if (err) throw err;
        })
    }
    for (let i = 0; i < 5; i++) {
        data = {name:"'push'",user_id:id,date_completed:"'"+dates[i]+"'"}
        insert_h(data);
    }
    for (let i = 0; i < 4; i++) {
        data = {name:"'pull'",user_id:id,date_completed:"'"+dates[i]+"'"}
        insert_h(data);
    }
    for (let i = 0; i < 2; i++) {
        data = {name:"'legs'",user_id:id,date_completed:"'"+dates[i]+"'"}
        insert_h(data);
    }
})
        
//http code:
console.log('app is running on port 3000');
app.listen(3000,'0.0.0.0');

//https code:
// var httpsServer = https.createServer(credentials, app);
// httpsServer.listen(3000,'0.0.0.0',()=>{console.log('app is running on port 3000');})

/* {
    ex_history : [ {reps:__,weight:__,volume:__, date-time:__}, {..}, {..} ..],
    max_weight : __,
    max_volume : __,
    }
*/

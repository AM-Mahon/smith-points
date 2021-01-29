var express = require('express');
var { Client } = require('pg');
var cors = require('cors');
var bodyParser = require('body-parser');
var path = require('path');

const pgClient = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

var initializeTable = async function(){
    res = await pgClient.query("SELECT COUNT(table_name) FROM INFORMATION_SCHEMA.TABLES WHERE table_name='points'");
    if(res.rows[0].count == 0){
        pgClient.query("CREATE TABLE POINTS (identikey TEXT, preferred TEXT, lastname TEXT, points INT);", (err, res) => {
            if(err){
                console.log(err);
                console.log("CRITICAL: Database not intialized");
            }
        })
    }
}

pgClient.connect();
initializeTable();

var putRow = async function(id, req){
    if(req.first == null || req.last == null || req.points == null){
        return new Promise(function(resolve, reject){
            reject("Missing column");
        });
    }
    res = await pgClient.query("SELECT COUNT(identikey) from points where identikey = $1;", [id]);
    if(res.rows[0].count == 0){
        return new Promise(function(resolve, reject){
            pgClient.query("INSERT INTO points VALUES ($1, $2, $3, $4);", [id, req.first, req.last, Number(req.points)], (err, res) => {
                if(err){
                    console.log(err);
                    reject(err);
                }
                else{
                    resolve(res);
                }
            })
        })
        
    }
    else{
        return new Promise(function(resolve, reject){
            pgClient.query("UPDATE points SET preferred = $1, lastname = $2, points = $3 WHERE identikey = $4;", [req.first, req.last, Number(req.points), id], (err, res) => {
                if(err){
                    console.log(err);
                    reject(err);
                }
                else{
                    resolve(res);
                }
            })
        })
    }
}

var getRow = async function(key){
    return new Promise(function(resolve, reject){
        pgClient.query("SELECT * FROM points WHERE identikey = $1;", [key], (err, res) => {
            if(err){
                reject(err);
            }
            else{
                resolve(res);
            }
        })
    })
}

var deleteRow = async function(id){
    res = await pgClient.query("SELECT COUNT(identikey) from points where identikey = $1;", [id]);
    if(res.rows[0].count == 0){
        return new Promise(function(resolve, reject){
            reject(404);
        });
    }
    else{
        return new Promise(function(resolve, reject){
            pgClient.query("DELETE FROM points WHERE identikey = $1;", [id], (err, res) => {
                if(err){
                    console.log(err);
                    reject(err);
                }
                else{
                    resolve(res);
                }
            })
        })
    }
}

var app = express();

app.use(cors())
app.use(bodyParser.json());

var server = app.listen(process.env.PORT || 8080, function () {
var port = server.address().port;
console.log("App now running on port", port);
});
 
app.get("/", function(req, res, next) {
    res.sendFile(path.join(__dirname+'/static/index.html'));
})

app.get("/css", function(req, res, next) {
    res.sendFile(path.join(__dirname+'/static/mystyles.css'))
})

app.get("/get/:id", function(req, res, next) {
    getRow(req.params.id.toLowerCase())
        .then(queryRes => {
            row = queryRes.rows[0];
            jsonRes = {first: row.preferred, last: row.lastname, points: row.points};
            res.contentType('application/json');
            res.send(JSON.stringify(jsonRes));
        })
        .catch(err => res.send("Provided ID not found "+err, 404))
});
  
app.put("/put/:id", function(req, res, next) {
    if(typeof(req.body.pass) == "undefined" || req.body.pass != process.env.PASS){
        res.status(403).send("Access denied");
    }
    else{
        putRow(req.params.id.toLowerCase(), req.body)
            .then(queryRes => {
                res.status(200).send(req.params.id+" update succeeded");
            })
            .catch(err => res.status(500).send(err));
    }
})

app.delete("/delete/:id", function(req, res, next) {
    if(typeof(req.body.pass) == "undefined" || req.body.pass != process.env.PASS){
        res.status(403).send("Access denied");
    }
    else{
        deleteRow(req.params.id.toLowerCase())
            .then(out => res.status(200).send(req.params.id+" removed from database."))
            .catch(err => {
                if(err == 404){
                    res.status(404).send(req.params.id+" not found in database.");
                }
                else{
                    res.status(500).send(err);
                }
            })
    }
})
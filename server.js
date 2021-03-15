const express = require('express');
const path = require('path');
const fs = require('fs');
const Datastore = require("nedb");
var app = express();

app.use(express.static('public'));
app.use(express.json());

const db = new Datastore({ filename: "foodList.db", autoload: true });
const category_db = new Datastore({ filename: "foodCategory.db", autoload: true });
let idNumber = 0;
let dbLength;

// get total data from database
function getData_db(cb) {
    db.find({}).exec(function (err, docs) { //need to exec to make it work!
        cb(err, docs);
    });
}

// get total data from database
function getCat_db(cb) {
    category_db.find({}).exec(function (err, docs) { //need to exec to make it work!
        cb(err, docs);
    });
}

function getLength_db() {
    db.find({}, function (err, docs) {
        dbLength = docs.length;
        console.log(dbLength);
        // return ;
    });
}

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views/index.html"));
});


app.get("/main", (req, res) => {
    res.sendFile(path.join(__dirname, "views/start.html"));
});

// response for foodInList
app.get("/current", (req, res) => {
    getData_db((err, data) => {
        res.json(data);
    });
});

// response for foodCategory
app.get("/category", (req, res) => {
    getCat_db((err, data) => {
        res.json(data);
    });
});

app.post("/send", (req, res) => {
    const current_id = (idNumber).toString();
    console.log(current_id);

    const newFood = {
        _id: current_id,
        Category: req.body.Category,
        Duration: req.body.Duration,
        TimeLeft: req.body.Duration,
        Date: new Date()
    };
    db.insert(newFood, function (err, entries) {
        console.log(entries);
    })

    idNumber++;
    // getLength_db();
    res.json("success");
})

app.post("/delete", (req, res) => {
    // const current_id = (idNumber).toString();
    // console.log(current_id);

    db.remove({ _id: req.body._id }, {}, function (err, numRemoved) {
        console.log(numRemoved);
    });

    res.json("success");
})


// update info every .. interval
var now = new Date();
var delay = 20 * 1000; // 1 hour in msec
var start = delay - (now.getMinutes() * 60 + now.getSeconds()) * 1000;


setTimeout(function doSomething() {
    // do the operation
    // update timeLeft every hour for now
    db.find({}).exec(function (err, docs) {
        if (err) {
            console.log(err);
        } else {
            docs.forEach(doc => {
                var temp = doc.TimeLeft - 1;
                // console.log(doc.TimeLeft);
                db.update({ _id: doc._id }, { $set: { TimeLeft: temp } }, {}, function (err, numReplaced) {
                    // console.log(numReplaced);
                })
            })
        }
    })

    // db.find({}, function (err, docs) {
    //     console.log(docs);
    // });

    // schedule the next tick
    setTimeout(doSomething, delay);
}, start);


app.listen(8000);
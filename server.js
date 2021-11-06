const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.DB;
var client = new MongoClient(uri);

try {
  client.connect();
  var con = client.db("mydb");
  console.log("db is connected");
} catch (err) {
  console.log(err);
}

const express = require("express");
const { response, request } = require("express");
const e = require("express");
const app = express();
app.use(express.json());

//app.use( express.urlencoded({extended:true}))
const PORT = process.env.PORT || 3000;

//READ
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.header(
    "Access-Control-Allow-Methods",
    "Authorization,GET,PUT,POST,DELETE,PATCH,OPTIONS"
  );

  // Request headers you wish to allow
  //res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,text/plain');
  res.setHeader("Access-Control-Allow-Headers", "*");

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});
app.use((req, res, next) => {
  if(req.method == "DELETE"){
     con.collection('synk').findOneAndDelete({id:req.body.id})
  }
  if (req.method != "GET" && req.method != "OPTIONS") {
    let id = req.body.id;
    let number = req.body.number;
    con.collection("synk").findOne({ id: id }, (err, res) => {
      if (err) throw err;
      if (res) {
        current = res.number;
          if (current < number) {
            if(id && number){
            con
              .collection("synk")
              .updateOne(
                { id: id },
                { $set: { number: number } },
                (err, res) => {
                  if (err) throw err;
                }
              );
            }
          }
      }
      else if (!res) {
        con.collection("synk").insertOne({ id: id, number: number });
      }
    });
  }
  next();
});

app.get("/synk", (req, res) => {
  con
    .collection("synk")
    .find({})
    .toArray((err, result) => {
      if (err) {
        res.sendStatus(400);
      } else {
        res.send(result).status(200);
      }
    });
});

app.get("/owner", (req, res) => {
  con
    .collection("cars")
    .find({})
    .toArray((err, result) => {
      if (err) {
        res.sendStatus(400);
      } else {
        res.send(result).status(200);
      }
    });
});
//create
app.post("/owner", (req, res) => {
  con
    .collection("indexes")
    .find({})
    .sort({ id: -1 })
    .limit(1)
    .toArray((err, result) => {
      if (err) {
      } else {
        if (typeof result[0] !== "undefined") {
          let currentIndex = result[0].value;
          req.body.id = currentIndex + 1;
          con
            .collection("indexes")
            .updateOne(
              { id: "cars" },
              { $set: { value: req.body.id } },
              (err, response) => {
                if (err) {
                  throw err;
                }
              }
            );
          con.collection("cars").insertOne(req.body);
          res.sendStatus(200);
        } else {
          req.body.id = 1;
          con.collection("indexes").insertOne({ id: "cars", value: 1 });
          con.collection("cars").insertOne(req.body);
          res.sendStatus(200);
        }
      }
    });
});
//DELETE
app.delete("/owner", (req, res) => {
  let id = req.body.id;
  con.collection("cars").findOneAndDelete({ id: id }, (err, response) => {
    if (err) {
      res.sendStatus(400);
    } else {
      res.sendStatus(200);
    }
  });
});
//UPDATE
app.put("/owner", (req, res) => {
  let id = { id: req.body.id };
  let update = { $set: req.body };
  con.collection("cars").updateOne(id, update, (err, response) => {
    if (err) {
      res.sendStatus(400);
      throw err;
    } else {
      res.sendStatus(200);
    }
  });
});

app.listen(PORT, () => {
  console.log("listing on " + PORT);
});

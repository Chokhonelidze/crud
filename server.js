const { MongoClient } = require("mongodb");

const uri =
  "mongodb://admin:cst10b002944@localhost:27017/mydb?retryWrites=true&w=majority";

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
app.get("/", (req, res) => {
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
app.post("/", (req, res) => {
  con
    .collection("cars")
    .find({})
    .sort({ id: -1 })
    .toArray((err, result) => {
      if (err) {
      } else {
      
        if (typeof(result[0]) !== "undefined") {
          let currentIndex = result[0].id;
          req.body.id = currentIndex + 1;
          con.collection("cars").insertOne(req.body);
          res.sendStatus(200);
        }
        else{
          req.body.id = 1;
          con.collection("cars").insertOne(req.body);
          res.sendStatus(200);
        }
      }
    });


});
//DELETE
app.delete("/", (req, res) => {
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
app.put("/", (req, res) => {
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

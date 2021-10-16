const express = require("express");
const app = express();
app.use(express.json());
//app.use( express.urlencoded({extended:true}))
const PORT = process.env.PORT || 3000;
const data = [
  {
    id: 1,
    address: "199 no address street",
    owner: "George",
    cars: [
      {
        brand: "Honda",
        model: "fit",
        year: "2009",
        color: "grey",
      },
      {
        brand: "Tesla",
        model: "Y",
        year: "2021",
        color: "blue",
      },
    ],
  },
];
//READ
app.get("/", (req, res) => {
  res.send(data);
});
//create
app.post("/", (req, res) => {
  req.body.id = data.length+1;
  data.push(req.body);
  res.sendStatus(200);
});
//DELETE
app.delete("/", (req, res) => {

  let id = req.body.id;
  for (let i in data) {
    if (data[i].id == id) {
      delete(data[i]);
      res.sendStatus(200);
      return true;
    }
  }
  res.sendStatus(400);

});
//UPDATE
app.put("/", (req, res) => {
    let id = req.body.id;
    for (let i in data) {
        if (data[i].id == id) {
          data[i] = req.body;
        }
        res.sendStatus(200);
        return true;
      }
      res.sendStatus(400);
});

app.listen(PORT, () => {
  console.log("listing on " + PORT);
});

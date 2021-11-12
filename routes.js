const express = require("express");
const indexes = require("./models/indexes");
const owner = require("./models/owner");
const router = express.Router();

router.get("/owner", async (req, res) => {
  let filter = {};
  if (req.query.id) {
    filter = { id: Number(req.query.id) };
  }
  try{
  const owners = await owner.find(filter);
   res.json(owners).status(204);
   return;
  }
  catch{
     res.sendStatus(404);
     return;
  }
});
router.post("/owner", async (req, res) => {
  let index = await indexes.findOne({ id: "owners" });
  if (!index) {
    index = new indexes({
      id: "owners",
      value: 0,
    });
  }
  index.value = index.value + 1;
  index.save();
  let obj = req.body;
  obj.id = index.value;
  const save = new owner(obj);
  try {
    await save.save();
     res.json({ id: save.id }).status(204);
     return
  } catch {
     res.sendStatus(404);
     return
  }
});
router.put("/owner", async (req, res) => {
  let input = req.body;
  try {
    let doc = await owner.findOneAndUpdate({ id: input.id }, input, {
      new: false,
      upset: false,
    });
     res.send({ id: doc.id }).status(204);
     return
  } catch(e) {
     res.json().sendStatus(404);
     return
  }
});
router.delete("/owner", async (req, res) => {
  let id = req.body.id;
  try {
    await owner.deleteOne({ id: id });
     res.sendStatus(204);
     return
  } catch {
     res.status(404);
     return
    res.send({ error: "can't delete" });
  }
});

module.exports = router;

const express = require("express");
const indexes = require("./models/indexes");
const owner = require("./models/owner");
const router = express.Router();

router.get("/owner", async (req, res) => {
  let filter = {};
  if (req.query.id) {
    filter = { id: Number(req.query.id) };
  }
  const owners = await owner.find(filter);
  res.json(owners).sendStatus(204);
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
    res.json({ id: save.id }).sendStatus(204);
  } catch {
    res.sendStatus(404);
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
  } catch(e) {
    res.json().sendStatus(404);
  }
});
router.delete("/owner", async (req, res) => {
  let id = req.body.id;
  try {
    await owner.deleteOne({ id: id });
    res.sendStatus(204);
  } catch {
    res.status(404);
    res.send({ error: "can't delete" });
  }
});

module.exports = router;

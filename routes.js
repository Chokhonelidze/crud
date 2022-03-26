const express = require("express");
const indexes = require("./models/indexes");
const owner = require("./models/owner");
const account = require("./models/account");
const items = require("./models/items");
const sync = require("./models/sync");
const router = express.Router();

async function runSync(key) {
  let rand = (lengh = 6) => {
    return Math.random().toString(20).substring(2, lengh);
  };
  try {
    let syncObj = await sync.findOne({ id: key });
    if (!syncObj) {
      syncObj = new sync({
        id: key,
        value: 0,
      });
    }
    syncObj.value = rand();
    syncObj.save();
  } catch (e) {
    console.log(e);
    res.json(e).sendStatus(404);
  }
}
router.get("/sync", async (req, res) => {

  let filter = {};
  filter.id = req.query.id;
  try {
    const value = (await sync.findOne(filter)).value;
    res.json(value).status(204);
    return;
  } catch(e) {
    res.json(e).status(400);
    return;
  }
});

router.get("/Items", async (req, res) => {
  let filter = {};
  if (req.query.id) {
    filter.id = req.query.id;
  }
  if (req.query.name) {
    filter.name = req.query.name;
  }
  try {
    const item = await items.find(filter);
    res.json(item).status(204);
    return;
  } catch {
    res.sendStatus(404);
    return;
  }
});

router.post("/Items", async (req, res) => {
  try {
    
    let filter = {};
    if (req.body.id) {
      filter.id = req.body.id;
    }
    if (req.body.name) {
      filter.name = req.body.name;
    }
    let item = await items.find(filter);
    if (item.length) {
      res.json({ error: "item is already there" }).status(404);
      return;
    }
    let index = await indexes.findOne({ id: "items" });
    if (!index) {
      index = new indexes({
        id: "items",
        value: 0,
      });
    }
    index.value = index.value + 1;
    index.save();
    let obj = req.body;
    obj.id = index.value;
    const save = new items(obj);

    await save.save();
    await runSync('Items');
    res.json({ id: save.id }).status(204);
    return;
  } catch (err) {
    res.json({ error: err }).status(404);
    return;
  }
});

router.put("/Items", async (req, res) => {
  let input = req.body;
  try {
    let filter = {};
    if (req.body.id) {
      filter.id = req.body.id;
    } else {
      filter.name = req.body.name;
    }
    let doc = await items.findOneAndUpdate(filter, input, {
      new: false,
      upset: false,
    });
    await runSync('Items');
    res.send({ id: doc.id }).status(204);
    return;
  } catch (e) {
    res.json(e).status(404);
    return;
  }
});
router.delete("/Items", async (req, res) => {
  let id = req.body.id;
  try {
    await items.deleteOne({ id: id });
    await runSync('Items');
    res.sendStatus(204);
    return;
  } catch {
    res.status(404);
    res.send({ error: "can't delete" });
    return;
  }
});

router.get("/account", async (req, res) => {
  let filter = {};
  if (req.query.name && req.query.password) {
    filter = { name: req.query.name, password: req.query.password };
  }
  try {
    const accounts = await account.find(filter).select("-password");
    res.json(accounts).status(204);
    return;
  } catch {
    res.sendStatus(404);
    return;
  }
});

router.post("/account", async (req, res) => {
  try {
    let accounts = await account.find({ name: req.body.name });
    if (accounts.length) {
      res.json({ error: "name is already used" }).status(404);
      return;
    }
    let index = await indexes.findOne({ id: "accounts" });
    if (!index) {
      index = new indexes({
        id: "accounts",
        value: 0,
      });
    }
    index.value = index.value + 1;
    index.save();
    let obj = req.body;
    obj.id = index.value;
    const save = new account(obj);

    await save.save();
    res.json({ id: save.id }).status(204);
    return;
  } catch (err) {
    res.json({ err: err }).status(404);
    return;
  }
});

router.put("/account", async (req, res) => {
  let input = req.body;
  try {
    let doc = await account.findOneAndUpdate(
      { name: input.name, password: input.password },
      input,
      {
        new: false,
        upset: false,
      }
    );
    res.send({ id: doc.id }).status(204);
    return;
  } catch (e) {
    res.json(e).status(404);
    return;
  }
});
router.delete("/account", async (req, res) => {
  let id = req.body.id;
  try {
    await account.deleteOne({ id: id });
    res.sendStatus(204);
    return;
  } catch {
    res.status(404);
    res.send({ error: "can't delete" });
    return;
  }
});

router.get("/owner", async (req, res) => {
  let filter = {};
  if (req.query.id) {
    filter = { id: Number(req.query.id) };
  }
  try {
    const owners = await owner.find(filter);
    res.json(owners).status(204);
    return;
  } catch {
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
    return;
  } catch {
    res.sendStatus(404);
    return;
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
    return;
  } catch (e) {
    res.json().sendStatus(404);
    return;
  }
});
router.delete("/owner", async (req, res) => {
  let id = req.body.id;
  try {
    await owner.deleteOne({ id: id });
    res.sendStatus(204);
    return;
  } catch {
    res.status(404);
    return;
    res.send({ error: "can't delete" });
  }
});

module.exports = router;

const express = require("express");
const indexes = require("./models/indexes");
const owner = require("./models/owner");
const account = require("./models/account");
const router = express.Router();

router.get("/account" , async (req,res) => {
  let filter = {};
  if(req.body.name) {
    filter = {name:req.body.name, password:req.body.password};
  }
  try{
    const accounts = await account.find(filter);
    res.json(accounts).status(204);
    return;
  }
  catch{
    res.sendStatus(404);
    return;
  }

});

router.post("/account" , async (req,res) => {
  try{
  let name = await account.findOne({name:req.body.name},(err,resource)=>{
    if(err){
      res.json({ error:err}).status(401);
      return;
    }
  });
  if(name){
    res.json({ error:"name is already used" }).status(401);
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
     return
  } catch (err){
     res.json({err:err}).status(404);
     return
  }

});

router.put("/account",async (req,res) =>{
  let input = req.body;
  try {
    let doc = await account.findOneAndUpdate({ id: input.id }, input, {
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
router.delete("/account", async (req, res) => {
  let id = req.body.id;
  try {
    await account.deleteOne({ id: id });
     res.sendStatus(204);
     return
  } catch {
     res.status(404);
     res.send({ error: "can't delete" });
     return
  
  }
});



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

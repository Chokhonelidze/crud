const mongoose = require("mongoose")

const schema = mongoose.Schema({
    id:Number,
    name:String,
    stack:Number,
    price:Number,
    discount:Number
},
{
    collection : 'items'
})
module.exports = mongoose.model("items",schema);

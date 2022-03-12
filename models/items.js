const mongoose = require("mongoose")

const schema = mongoose.Schema({
    id:Number,
    name:String,
    img :String,
    stack:Number,
    price:Number,
    discount:Number,
    info:String
},
{
    collection : 'items'
})
module.exports = mongoose.model("items",schema);

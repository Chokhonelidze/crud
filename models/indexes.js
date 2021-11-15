const mongoose = require("mongoose")

const schema = mongoose.Schema({
    id:String,
    value:Number
},
{
    collection : 'indexes'
})
module.exports = mongoose.model("indexes",schema);

const mongoose = require("mongoose")

const schema = mongoose.Schema({
    id:String,
    value:String,
},
{
    collection : 'sync'
})
module.exports = mongoose.model("sync",schema);
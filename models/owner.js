const mongoose = require("mongoose")

const schema = mongoose.Schema({
    id:Number,
    address:String,
    owner:String,
    cars :[],
},
{
    collection : 'owners'
})
module.exports = mongoose.model("owner",schema);

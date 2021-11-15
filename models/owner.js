const mongoose = require("mongoose")

const schema = mongoose.Schema({
    id:Number,
    address:{type:String,required:true},
    owner:{type:String,required:true},
    cars :[],
},
{
    collection : 'owners'
})
module.exports = mongoose.model("owner",schema);

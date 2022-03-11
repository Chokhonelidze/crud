const mongoose = require("mongoose")

const schema = mongoose.Schema({
    id:Number,
    name:String,
    email:String,
    password:{String,select: false},
    deposit:Number
},
{
    collection : 'accounts'
})
module.exports = mongoose.model("account",schema);

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    timeStamp:{
        type: Date,
        default: Date.now
    }
})

const User = mongoose.model('user',UserSchema)
User.createIndexes()
module.exports = User
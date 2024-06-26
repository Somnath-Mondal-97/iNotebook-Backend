const mongoose = require('mongoose')
const Schema = mongoose.Schema

const NoteSchema = new mongoose.Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'user'
    },
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    tag:{
        type:String,
        default:'General'
    },
    timeStamp:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('notes',NoteSchema)
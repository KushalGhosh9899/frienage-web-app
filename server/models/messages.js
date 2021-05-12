const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    id1:{
        type:String,
        required:true
    },
    id2:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    senderId:{
        type:String,
        required:true
    },
    sentOn:{
        type:String,
        required:true
    }
})

mongoose.model('Message',roomSchema);
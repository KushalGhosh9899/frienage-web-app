const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    conversationId:{
        type:String
    },
    sender:{
        type:String,
    },
    text:{
        type:String
    },
    senderPic:{
        type:String
    }
},{timestamps:true})

mongoose.model('Message',MessageSchema);
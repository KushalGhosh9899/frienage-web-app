const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
    members:{
         type:Array
    },
    roomId:{
        type:String
    }
},{timestamps:true})

mongoose.model('Conversation',ConversationSchema);
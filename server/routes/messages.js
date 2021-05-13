const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin');
const Message = mongoose.model("Message");
const Conversation = mongoose.model("Conversation");

//new conversation

router.post('/conversation',requireLogin,(req,res)=>{
    const newConversation = new Conversation({
        members:[req.body.senderId,req.body.receiverId],
    })

    newConversation.save().then(result=>{
        return res.status(200).json({result})
    })
    .catch(err=>{
        console.log(err)
    })
})

//get conversation of a user

router.get('/conversation/:userid',requireLogin,(req,res)=>{
    Conversation.find({
        members:{$in:[req.params.userid]}
    }).then(result=>{
        return res.status(200).json({result})
    })
    .catch(err=>{
        console.log(err)
    })
})

//Add Message
router.post('/message',requireLogin,(req,res)=>{
    const newMessage = new Message(req.body)
    newMessage.save().then(result=>{
        return res.status(200).json({result})
    })
    .catch(err=>{
        console.log(err)
    })
})
//Get Message
router.get('/message/:conversationId',requireLogin,(req,res)=>{
    Message.find({
        conversationId: req.params.conversationId
    }).then(result=>{
        return res.status(200).json({result})
    })
    .catch(err=>{
        console.log(err)
    })

})


module.exports = router;
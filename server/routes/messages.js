const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin');
const Message = mongoose.model("Message");
const Conversation = mongoose.model("Conversation");

//new conversation

router.post('/conversation', requireLogin, (req, res) => {
    const newConversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId],
        roomId: req.body.senderId + "" + req.body.receiverId
    })

    newConversation.save().then(data => {
        return res.status(200).json({ data })
    })
        .catch(err => {
            console.log(err)
        })
})

//get conversation of a user

router.get('/conversation/:userid', requireLogin, (req, res) => {
    Conversation.find({
        members: { $in: [req.params.userid] }
    }).then(data => {
        return res.status(200).json({ data })
    })
        .catch(err => {
            console.log(err)
        })
})

router.get('/findconversation/:userid/:secondid', requireLogin, (req, res) => {
    const id1 = req.params.userid + '' + req.params.secondid
    const id2 = req.params.secondid + '' + req.params.userid
    // console.log("id1",id1) 
    // console.log("id1",id2) 
    Conversation.find({
        roomId: id1
    })
        .then(data => {
            if (data.length == 0) {
                Conversation.find({
                    roomId: id2
                })
                    .then(data => {
                        return res.status(200).json({ data })
                    })
            }
            return res.status(200).json({ data })
        })
        .catch(err => {
            console.log(err)
        })
})

//Add Message
router.post('/message', requireLogin, (req, res) => {
    const newMessage = new Message(req.body.message)
    newMessage.save().then(data => {
        return res.status(200).json({ data })
    })
        .catch(err => {
            console.log(err)
        })
})
//Get Message
router.get('/message/:conversationId', requireLogin, (req, res) => {
    Message.find({
        conversationId: req.params.conversationId
    }).then(data => {
        return res.status(200).json({ data })
    })
        .catch(err => {
            console.log(err)
        })

})


module.exports = router;
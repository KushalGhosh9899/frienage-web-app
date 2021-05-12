const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin');
const Message = mongoose.model("Message");

router.post('/sendmessage', requireLogin, (req, res) => {
    const { id1, messageContent } = req.body;
    if (!id1 || !messageContent) {
        return res.status(422).json({ error: "Cannot send Empty Message" });
    }

    let date_ob = new Date();
    let ampm='AM';
    // current hours    
    let hours = date_ob.getHours();
    // current minutes
    let minutes = date_ob.getMinutes();

    if (hours > 12 && minutes > 01) {
        hours = hours - 12;
        ampm='PM';
    }
    let sentTime = hours + ':' + minutes +' '+ ampm;

    const sendMessage = new Message({
        id1,
        id2: req.user._id,
        message: messageContent,
        senderId: req.user._id,
        sentOn: sentTime
    })
    sendMessage.save().then(result => {
        res.json({ result })
    })
        .catch(err => {
            console.log(err);
        })

})
router.get('/viewmessage',requireLogin,(req,res)=>{
    Message.find()
    .then(result => {
        res.json({ result });
    })
    .catch(err => {
        console.log(err);
    })
})
module.exports = router;
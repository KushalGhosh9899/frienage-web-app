const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../keys');
const requireLogin = require('../middleware/requireLogin');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:"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"
    }
}))

router.post('/signup',(req,res)=>{
    const {name,email,password,pic} = req.body;
    if(!email || !password || !name){
        return res.status(422).json({error:"please add all the fields"});
    }
    User.findOne({email:email})
        .then((savedUser)=>{
            if(savedUser){
                return res.status(422).json({error:"User Already exists"});
            }
            bcrypt.hash(password,12)
            .then(hashedpassword=>{                
            const user = new User({
                email,
                password:hashedpassword,
                name,
                pic:pic
            })
            user.save()
            .then(user=>{
                transporter.sendMail({
                    to:user.email,
                    from:"kushalghosh9899@gmail.com",
                    subject:"Signup Success",
                    html:"<h1>Welcome to Instagram</h1>"
                })
                res.json({message:"Successfully Saved"});
                
                
            })
            .catch(err=>{
                console.log(err);
            })
            })
        })
        .catch(err=>{
            console.log(err);
        })
})

router.post('/signin',(req,res)=>{
   const {email,password} = req
   .body;
   if(!email || !password){
    return res.status(422).json({error:"please provide email and password"});
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error:"Invalid email and password"});
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                //return res.json({error:"Successfully signed in"});
                const token = jwt.sign({_id:savedUser._id},JWT_SECRET);
                const {_id,name,email,followers,following,pic} = savedUser;
                res.json({token,user:{_id,name,email,followers,following,pic}});
            }
            else{
                return res.status(422).json({error:"Invalid email and password"});                                
            }
        })
    })
    .catch(err=>{
        console.log(err);
    })
})

router.post('/reset-password',(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err);
        }
        const token = buffer.toString("hex")
        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                return res.status(404).json({error:"User doesnot Exists"})
            }
            user.resetToken = token;
            user.expireToken = Date.now() + 3600000 //Date is in Millisecond
            user.save().then((result)=>{
                transporter.sendMail({
                    to:user.email,
                    from:"kushalghosh9899@gmail.com",
                    subject:"Reset your Password",
                    html:`<h1>Reset Your Password</h1>
                    <h2>This link is valid for 1 hour only</h1>
                    <h5>Click this link to <a href="http://localhost:3000/reset-password/${token}">reset password</a></h5>`
                })
                res.json({message:"Check Your Email"})
            })
            
        })
    })
})

router.post('/new-password',(req,res)=>{
    const newPassword = req.body.password
    const sentToken = req.body.token
    User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"Try Again session Expired"})
        }
        bcrypt.hash(newPassword,12)
        .then(hashedpassword=>{
            user.password = hashedpassword
            user.resetToken = undefined
            user.expireToken = undefined
            user.save().then((savedUser)=>{
                res.json({message:"Password Successfully Updated"})
            })
        })
    }).catch(err=>{
        console.log(err);
    })
})

module.exports = router;
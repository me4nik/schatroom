const express = require('express');
const router = express.Router();
const Message = require("../models/messages");

router.get('/messages/list/:page', (req, res) => {
    Message.find({},(err, messages)=> {
        messages.splice(0, ((req.params.page) * 10));
        messages = messages.splice(0, 7);
        if(messages.length === 0) {
            res.sendStatus(404);
            return;
        }
        res.status(200).json(messages);
    })
});

router.get('/messages/single/:id', (req, res) => {
    Message.find({_id: req.params.id},(err, message)=> {
        if(!message) {
            res.sendStatus(404);
            return;
        }
        res.status(200).json(message);
    })
});

router.post('/messages/create', async (req, res) => {
    try{
        if (!validateEmail(req.body.email)) {
            res.status(400).send({ error: 'Email is invalid' });
            return;
        }
        if (!validateMessage(req.body.text)) {
            res.status(400).send({ error: 'Message is invalid' });
            return;
        }
        const message = new Message({email: req.body.email, text: req.body.text, createDate: new Date().toISOString()});
        await message.save();
        req.io.emit('message', req.body);
        res.sendStatus(201).json(message);
    }
    catch (error){
        res.sendStatus(500);
        return console.log('error',error);
    }
});

function validateMessage(message) {
    return (message.length <= 100) && (message.length > 0)
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return(re.test(email))
}

module.exports = router;
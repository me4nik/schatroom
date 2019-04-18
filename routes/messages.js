const express = require('express');
const router = express.Router();
const Message = require("../models/messages");

router.get('/', function(req, res) {
    Message.find({},(err, messages)=> {
        res.send(messages);
    })
});

router.post('/', (req, res) => {
    try{
        const message = new Message(req.body);
        message.save();
        req.io.emit('message', req.body);
        res.sendStatus(201);
    }
    catch (error){
        res.sendStatus(500);
        return console.log('error',error);
    }
});

module.exports = router;
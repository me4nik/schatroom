var mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    email: { type: String, required: true },
    text: { type: String, required: true },
    createDate: { type: String, required: true },
});

const Message = mongoose.model('Message',MessageSchema);

module.exports = Message;

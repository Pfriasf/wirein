const mongoose = require("mongoose")
const User = require("./User.model")
const chatRoom = require("./Chatroom.model")

const ChatDetailSchema = new mongoose.Schema({
    userOrigin: String,
    userReciever: String,
    message: String,
    timeStamp: Date
})

const ChatDetail = mongoose.model("ChatDetail", ChatDetailSchema);
module.exports = ChatDetail;
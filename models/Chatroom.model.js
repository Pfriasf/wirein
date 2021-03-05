const mongoose = require("mongoose")
const User = require("./User.model")


const ChatRoomSchema = new mongoose.Schema({
    userOrigin: String,
    userReceiver: String,
    status: Boolean,
    chatDetail: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatDetail'
    },
})

const ChatRoom = mongoose.model("ChatRoom", ChatRoomSchema);
module.exports = ChatRoom;
const mongoose = require("mongoose");
const ChatRoom = require("../models/Chatroom.model");
const ChatDetail = require("../models/ChatDetail.model");
const User = require("../models/User.model");
//Create chatroom

const createChat = (req, res, next) => {
    //1.entradas: los usuarios, 
    const userOrigin = req.body.userOrigin;
    const userReceiver = req.body.userReceiver;

    //2.proceso: crear el chatroom y guardarlo en la db

    const newChatRoom = { userOrigin, userReceiver, status: true }
    ChatRoom.create(newChatRoom)
        .then(() => { //3.salida: redirigir view del chat
            res.render('/chat')
        }).catch((e) => next(e));

};


//Send a message: push a la conversación

//1.entradas: enviar mensaje, usuarios, en que chatroom está

const sendMessage = (req, res, next) => {
    const userOrigin = req.body.userOrigin;
    const userReceiver = req.body.userReceiver;
    const chatRoom = req.body.ChatRoom;
    const message = req.body.message;
    const timeStamp = new Date();
    //2.proceso: recoger el chatroom, crear el mensaje, push al chatroom

    const newMessage = {
        userOrigin,
        userReceiver,
        message,
        timeStamp
    }

    ChatRoom.findOneAndUpdate({

            chatRoomId: chatRoom

        }, {
            $push: { chatDetail: new ChatDetail(newMessage) }
        })
        .then((chat) => {
            console.log('chat actualizado', Chat)
            return chat;
        })

}

//3.salida: renderizar el mensaje en el chatview




//Receive a message: get chatDetail

const getChat = (req, res, next) => {

    const chatRoomId = req.params.chatRoomId;
    ChatRoom.findOne({ chatRoomId })
        .then((chat) => {
            return chat
        })

}


//1.entradas:chatroom, 
//2.proceso: renderizar la conversación en el chatview
//2.proceso: renderizar la conversación en el chatviewchatview
module.exports = { createChat, sendMessage, getChat }
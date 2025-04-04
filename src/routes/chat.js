const express = require ("express");
const {userAuth} = require ("../middleware/auth");
const { Chat } = require("../model/chat");

const chatRouter = express.Router();

chatRouter.get ("/chat/:targetUserId", userAuth ,async (req, res) => {
    const {targetUserId} = req.params;
    const userId = req.user._id;

    try {
        let chat = await Chat.findOne ({
            participants : {$all : [userId, targetUserId]},
        }).populate({
            path: "messages.senderId",
            select: "firstName lastName",
          });

        if (!chat) {
            chat = new Chat ({
                participants : [userId, targetUserId],
                messages : [],
            });

            await chat.save();
        }

        console.log (chat);
        res.send (chat);
    }

    catch (err) {
        console.log (err);
    }
})

module.exports = chatRouter;
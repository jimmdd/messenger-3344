const router = require("express").Router();
const createHttpError = require("http-errors");
const { Op } = require("sequelize");
const { Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender, status } = req.body;

    // if we already know conversation id, we can save time and just add it to message and return
    if (conversationId) {
      const message = await Message.create({ senderId, text, conversationId, status });
      return res.json({ message, sender });
    }
    // if we don't have conversation id, find a conversation to make sure it doesn't already exist
    let conversation = await Conversation.findConversation(
      senderId,
      recipientId
    );

    if (!conversation) {
      // create conversation
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
      });
      if (onlineUsers.includes(sender.id)) {
        sender.online = true;
      }
    }
    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id,
      status: status
    });
    res.json({ message, sender });
  } catch (error) {
    next(error);
  }
});

router.put("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }

    const { conversationId, senderId, status = 'READ' } = req.body;
    // if conversationId exists, then update all messages with this senderID to 'READ'
    if (conversationId && senderId) {
      const message = await Message.update({ status }, {
        where: {
          conversationId,
          senderId,
          status: {
            [Op.ne]: 'READ'
          }
        }
      });
      return res.json({ message });
    } else {
      next(createHttpError(400, 'conversationId and senderId are required'))
    }

  } catch (error) {
    next(error);
  }
});


module.exports = router;

const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
const MessageStatus = require("./messageStatus");
const ConversationUser = require("./conversationUser");

// associations
User.belongsToMany(Conversation, { through: ConversationUser });
Conversation.belongsToMany(User, { through: ConversationUser });
Conversation.hasMany(Message)
Message.hasMany(MessageStatus)

module.exports = {
  User,
  Conversation,
  Message
};

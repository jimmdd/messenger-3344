const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
const MessageStatus = require("./messageStatus");

// associations
Message.belongsTo(Conversation);
Conversation.hasMany(Message);
Conversation.belongsToMany(User, { through: 'user_conversation' });
User.belongsToMany(Conversation, { through: 'user_conversation' });
Message.belongsToMany(Conversation, { through: MessageStatus })
Conversation.belongsToMany(Message, { through: MessageStatus })

module.exports = {
  User,
  Conversation,
  Message
};

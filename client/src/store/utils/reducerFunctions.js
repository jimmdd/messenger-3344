export const addMessageToStore = (state, payload) => {
  const { message, sender } = payload;
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
      status: 'SENT',
    };
    newConvo.latestMessageText = message.text;
    newConvo.unreadMessagesCount = 1
    return [newConvo, ...state];
  }

  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      convo.messages.push(message);
      convo.latestMessageText = message.text;
      if (convo.otherUser.id === message.senderId) {
        convo.unreadMessagesCount = convo.unreadMessagesCount ? convo.unreadMessagesCount + 1 : 1
      }
      return { ...convo };
    } else {
      return convo;
    }
  });
};

export const updateMessagesStatusToStore = (state, payload) => {
  const { conversationId, senderId, status } = payload
  return state.map((convo) => {
    if (convo.id === conversationId) {
      let lastReadId = convo.lastReadMessageId
      convo.messages.map(message => {
        if (message.senderId === senderId) {
          message.status = status
        }
        // update the last read index for current user
        if (convo.otherUser.id !== senderId && message.senderId === senderId) {
          lastReadId = message.id
        }
        return message
      })
      // reset the unread message count after update status
      if (convo.otherUser.id === senderId) {
        convo.unreadMessagesCount = 0
      }
      convo.lastReadMessageId = lastReadId
      return { ...convo }
    }
    return convo
  })
}

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = true;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = false;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      convo.id = message.conversationId;
      convo.messages.push(message);
      convo.latestMessageText = message.text;
      return { ...convo };
    } else {
      return convo;
    }
  });
};

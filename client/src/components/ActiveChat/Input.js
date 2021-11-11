import React, { useState } from "react";
import { FormControl, FilledInput } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { postMessage } from "../../store/utils/thunkCreators";
import { updateMessagesStatus } from "../../store/utils/thunkCreators";

const useStyles = makeStyles(() => ({
  root: {
    justifySelf: "flex-end",
    marginTop: 15
  },
  input: {
    height: 70,
    backgroundColor: "#F4F6FA",
    borderRadius: 8,
    marginBottom: 20
  }
}));

const Input = (props) => {
  const classes = useStyles();
  const [text, setText] = useState("");
  const {
    postMessage,
    updateMessagesStatus,
    unreadMessagesCount,
    otherUser,
    conversationId,
    user
  } = props;

  const handleChange = (event) => {
    setText(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // add sender user info if posting to a brand new convo, so that the other user will have access to username, profile pic, etc.
    const reqBody = {
      text: event.target.text.value,
      recipientId: otherUser.id,
      conversationId,
      sender: conversationId ? null : user,
      status: 'SENT'
    };
    await postMessage(reqBody);
    setText("");
  };

  // update messages read status onFocus event
  const handleUpdate = async () => {
    if (unreadMessagesCount > 0) {
      const reqBody = {
        conversationId,
        senderId: otherUser.id,
        status: 'READ'
      };
      await updateMessagesStatus(reqBody);
    }
  }

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <FormControl fullWidth hiddenLabel>
        <FilledInput
          classes={{ root: classes.input }}
          disableUnderline
          placeholder="Type something..."
          value={text}
          name="text"
          onChange={handleChange}
          onFocus={handleUpdate}
        />
      </FormControl>
    </form>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    postMessage: (message) => {
      dispatch(postMessage(message));
    },
    updateMessagesStatus: (payload) => {
      dispatch(updateMessagesStatus(payload))
    }
  };
};

export default connect(null, mapDispatchToProps)(Input);

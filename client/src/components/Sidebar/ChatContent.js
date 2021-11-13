import React from "react";
import { Box, Chip, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: 20,
    flexGrow: 1,
  },
  username: {
    fontWeight: "bold",
    letterSpacing: -0.2,
  },
  previewTextBold: {
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: -0.17,
  },
  previewText: {
    fontSize: 12,
    color: "#9CADC8",
    letterSpacing: -0.17,
  },
  unreadMessageChip: {
    background: "#3F92FF",
    marginRight: 20
  }
}));

const ChatContent = (props) => {
  const classes = useStyles();

  const { conversation } = props;
  const { latestMessageText, otherUser, unreadMessagesCount } = conversation;
  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography className={unreadMessagesCount > 0 ? classes.previewTextBold : classes.previewText}>
          {latestMessageText}
        </Typography>
      </Box>
      <Box>
        {
          unreadMessagesCount > 0 &&
          <Chip className={classes.unreadMessageChip} color="primary" size="small" label={unreadMessagesCount} />
        }
      </Box>
    </Box>
  );
};

export default ChatContent;

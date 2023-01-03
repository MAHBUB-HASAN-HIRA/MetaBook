import { Avatar } from "@material-ui/core";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../Context/AuthContext";
import styles from "./Conversation.module.scss";

const Conversation = ({ conversation, handleSelectConversation }) => {
  const { loggedInUser } = useContext(AuthContext);
  const [user, setUser] = useState({});

  useEffect(() => {
    const friendId = conversation?.members.find(
      (member) => member !== loggedInUser?._id
    );
    const getFriends = async () => {
      const res = await axios
        .get(
          `https://api-metabook-by-mahbub.onrender.com/api/users?userId=${friendId}`,
          {
            headers: {
              "Content-Type": "application/json",
              token: `Bearer ${loggedInUser?.token}`,
            },
          }
        )
        .catch((err) => err.response && console.log(err));
      res.data && setUser(res?.data);
    };
    loggedInUser?._id && getFriends();
  }, [conversation?.members, loggedInUser?._id, loggedInUser?.token]);

  return (
    <div
      className={styles.conversation}
      onClick={() => handleSelectConversation(user)}
    >
      <Avatar
        load="lazy"
        src={user?.profilePicture}
        className={styles.conversationImg}
        alt={user?.fullName}
      />
      <span className={styles.conversationName}>{user?.fullName}</span>
    </div>
  );
};

export default Conversation;

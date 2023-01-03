import { Avatar } from "@material-ui/core";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../Context/AuthContext";
import styles from "./ChatOnline.module.scss";

const ChatOnline = ({
  onlineUsers,
  setCurrentChat,
  handleSelectConversation,
}) => {
  const { loggedInUser } = useContext(AuthContext);
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  useEffect(() => {
    const getFriends = async () => {
      try {
        const friendsList = await axios.get(
          `https://api-metabook-by-mahbub.onrender.com/api/users/friends/${loggedInUser?._id}`,
          {
            headers: {
              "Content-Type": "application/json",
              token: `Bearer ${loggedInUser?.token}`,
            },
          }
        );
        friendsList?.data?.length > 0 && setFriends([...friendsList.data]);
      } catch (error) {}
    };
    loggedInUser?._id && getFriends();
  }, [loggedInUser?._id, loggedInUser?.token]);

  useEffect(() => {
    setOnlineFriends(friends.filter((f) => onlineUsers?.includes(f?._id)));
  }, [friends, onlineUsers]);

  const handleClick = async (user) => {
    handleSelectConversation(user);
    const res = await axios
      .get(
        `https://api-metabook-by-mahbub.onrender.com/api/conversation/find/${loggedInUser?._id}/${user?._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            token: `Bearer ${loggedInUser?.token}`,
          },
        }
      )
      .catch((err) => err.response && console.log(err));
    res?.data?.conversation?._id && setCurrentChat(res?.data?.conversation);
  };

  return (
    <div className={styles.chatOnline}>
      <h2 className={styles.onlineFriendHeading}>Online Friends</h2>
      {onlineFriends.map((f, index) => (
        <div
          onClick={() => handleClick(f)}
          key={index + f?._id}
          className={styles.chatOnlineFriend}
        >
          <div className={styles.chatOnlineImgContainer}>
            <Avatar src={f.profilePicture} className={styles.chatOnlineImg} />
            <div className={styles.chatOnlineBadge}></div>
          </div>
          <span className={styles.chatOnlineName}>{f.fullName}</span>
        </div>
      ))}
    </div>
  );
};

export default ChatOnline;

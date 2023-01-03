import { Avatar } from "@material-ui/core";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { format } from "timeago.js";
import { AuthContext } from "../../../../Context/AuthContext";
import styles from "./Message.module.scss";

const Message = ({ message }) => {
  const { loggedInUser } = useContext(AuthContext);
  const [user, setUser] = useState({});

  useEffect(() => {
    const getFriends = async () => {
      const res = await axios
        .get(
          `https://api-metabook-by-mahbub.onrender.com/api/users?userId=${message?.sender}`,
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
  }, [message?.sender, loggedInUser?._id, loggedInUser?.token]);

  return (
    <div
      className={
        message?.sender === loggedInUser?._id
          ? ` ${styles.message} ${styles.own}`
          : `${styles.message}`
      }
    >
      <div className={styles.messageTop}>
        <Avatar
          src={user?.profilePicture}
          className={styles.messageImg}
          alt={user?.fullName}
        />
        <p className={styles.messageText}>{message?.text}</p>
      </div>
      <div className={styles.messageBottom}>{format(message.createdAt)}</div>
    </div>
  );
};

export default Message;

import { Button } from "@material-ui/core";
import axios from "axios";
import React, { useContext, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "../../../../Context/AuthContext";
import styles from "./SuggestionFriend.module.scss";
const SuggestionFriend = ({ user }) => {
  const { username } = useParams();
  const { loggedInUser } = useContext(AuthContext);
  const [remove, setRemove] = useState(false);

  const checkConversation = async () => {
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
    if (res?.data?.conversation?._id) {
      return true;
    } else {
      return false;
    }
  };

  const createConversation = async () => {
    const res = await axios
      .post(
        `https://api-metabook-by-mahbub.onrender.com/api/conversation`,
        {
          senderId: loggedInUser?._id,
          receiverId: user?._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            token: `Bearer ${loggedInUser?.token}`,
          },
        }
      )
      .catch((err) => err.response && console.log(err));
    if (res?.data?.conversation?._id) {
      return true;
    } else {
      return false;
    }
  };

  const handleUserFollow = async () => {
    try {
      const res = await axios
        .put(
          `https://api-metabook-by-mahbub.onrender.com/api/users/${user?._id}/follow`,
          { userId: loggedInUser?._id },
          {
            headers: {
              "Content-Type": "application/json",
              token: `Bearer ${loggedInUser?.token}`,
            },
          }
        )
        .catch((err) => err.response && console.log(err.response));
      if (res?.data) {
        const isConversation = await checkConversation();
        if (isConversation) {
          setRemove(true);
          window.location.reload();
        } else {
          await createConversation();
          setRemove(true);
          window.location.reload();
        }
      }
    } catch (err) {}
  };

  return (
    <>
      {!remove && username !== user?.username && (
        <li className={styles.sidebarFriend}>
          <div className={styles.sidebarFriendTop}>
            <Link to={`/profile/${user.username}`}>
              <img
                loading="lazy"
                src={user?.profilePicture}
                alt=""
                className={styles.sidebarFriendImg}
              />
            </Link>
            <Link
              className={styles.sidebarFriendName}
              to={`/profile/${user.username}`}
            >
              <span>{user?.fullName}</span>
            </Link>
          </div>
          <div className={styles.sidebarFriendBottom}>
            <Button
              onClick={handleUserFollow}
              className={styles.follow}
              variant="contained"
            >
              Follow
            </Button>
            <Button
              onClick={() => setRemove(true)}
              className={styles.remove}
              variant="contained"
            >
              Remove
            </Button>
          </div>
        </li>
      )}
    </>
  );
};

export default SuggestionFriend;

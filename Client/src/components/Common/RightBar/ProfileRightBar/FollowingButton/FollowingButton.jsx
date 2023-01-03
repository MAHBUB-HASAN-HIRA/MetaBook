import { CircularProgress } from "@material-ui/core";
import { Add, Remove } from "@material-ui/icons";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../../Context/AuthContext";
import styles from "./FollowingButton.module.scss";

const FollowingButton = ({ user }) => {
  const { loggedInUser } = useContext(AuthContext);
  const [followed, setFollowed] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

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

  const handleFollow = async () => {
    setIsFetching(true);
    try {
      const url = followed
        ? `https://api-metabook-by-mahbub.onrender.com/api/users/${user?._id}/unfollow`
        : `https://api-metabook-by-mahbub.onrender.com/api/users/${user?._id}/follow`;

      const res = await axios
        .put(
          url,
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
          setIsFetching(false);
          setFollowed(!followed);
          window.location.reload();
        } else {
          await createConversation();
          setIsFetching(false);
          setFollowed(!followed);
          window.location.reload();
        }
      }
    } catch (err) {}
  };

  useEffect(() => {
    setFollowed(loggedInUser?.followings?.includes(user?._id));
  }, [user?._id, loggedInUser?.followings]);

  return (
    <>
      {user?.username !== loggedInUser?.username && (
        <button
          className={styles.rightBarFollowButton}
          onClick={handleFollow}
          style={{
            display: !user.username ? "none" : "flex",
            backgroundColor: followed ? "#0c9400" : "#1872f2",
          }}
        >
          {followed ? "Unfollow" : "Follow"}
          {followed ? (
            isFetching ? (
              <CircularProgress
                className={styles.loading}
                color="inherit"
                size="20px"
              />
            ) : (
              <Remove />
            )
          ) : isFetching ? (
            <CircularProgress
              className={styles.loading}
              color="inherit"
              size="20px"
            />
          ) : (
            <Add />
          )}
        </button>
      )}
    </>
  );
};

export default FollowingButton;

import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../../../Context/AuthContext";
import LoadingBar from "../../../Helper/LoadingBar/LoadingBar";
import styles from "./UserFriends.module.scss";

const UserFriends = ({ user }) => {
  const [friends, setFriends] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const { loggedInUser } = useContext(AuthContext);

  useEffect(() => {
    const getFriends = async () => {
      try {
        setIsFetching(true);
        const friendsList = await axios.get(
          `https://api-metabook-by-mahbub.onrender.com/api/users/friends/${user?._id}`,
          {
            headers: {
              "Content-Type": "application/json",
              token: `Bearer ${loggedInUser?.token}`,
            },
          }
        );
        friendsList?.data?.length > 0 && setFriends([...friendsList.data]);
        setIsFetching(false);
      } catch (error) {
        setIsFetching(false);
      }
    };
    user?._id && getFriends();
  }, [user?._id, loggedInUser?.token]);

  return (
    <>
      <h4 className={styles.rightBarTitle}>User Followings</h4>
      <div className={styles.rightBarFollowings}>
        {isFetching ? (
          <LoadingBar />
        ) : (
          friends.map((friend, index) => (
            <div key={index} className={styles.rightBarFollowing}>
              <Link to={`/profile/${friend?.username}`}>
                <img
                  loading="lazy"
                  src={friend?.profilePicture}
                  className={styles.rightBarFollowingImg}
                  alt=""
                />{" "}
              </Link>
              <Link
                className={styles.rightBarFollowingName}
                to={`/profile/${friend?.username}`}
              >
                <span>{friend?.fullName}</span>
              </Link>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default UserFriends;

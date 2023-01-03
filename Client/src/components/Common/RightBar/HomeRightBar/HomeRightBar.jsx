import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../Context/AuthContext";
import LoadingBar from "../../Helper/LoadingBar/LoadingBar";
import Online from "../../Helper/OnlineFriend/OnlineFriend";
import styles from "./HomeRightBar.module.scss";
const HomeRightBar = () => {
  const [friends, setFriends] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const { loggedInUser } = useContext(AuthContext);

  useEffect(() => {
    const getFriends = async () => {
      try {
        setIsFetching(true);
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
        setIsFetching(false);
      } catch (error) {
        setIsFetching(false);
      }
    };
    loggedInUser?._id && getFriends();
  }, [loggedInUser?._id, loggedInUser?.token]);
  return (
    <div className={styles.homeRightBar}>
      <div className={styles.birthdayContainer}>
        <img
          loading="lazy"
          src="https://i.ibb.co/myRBR7y/gift.png"
          className={styles.birthdayImg}
          alt=""
        />
        <span className={styles.birthdayText}>
          <b>Pola Foster</b> and <b>3 other friends</b> have birthday today.
        </span>
      </div>
      <img
        className={styles.rightBarAd}
        loading="lazy"
        src="https://i.ibb.co/TYkPQ62/ad.png"
        alt=""
      />
      <h4 className={styles.rightBarTitle}>My Friends</h4>
      <ul className={styles.rightBarFriendList}>
        {isFetching ? (
          <LoadingBar />
        ) : (
          friends.map((user) => (
            <Online user={user} key={user?._id + user?.username} />
          ))
        )}
      </ul>
    </div>
  );
};

export default HomeRightBar;

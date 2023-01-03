import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import LoadingBar from "../Helper/LoadingBar/LoadingBar";
import SuggestionFriend from "../Helper/SuggestionFriend/SuggestionFriend";
import styles from "./PeopleMayKnow.module.scss";

const PeopleMayKnow = () => {
  const { loggedInUser } = useContext(AuthContext);
  const [isFetching, setIsFetching] = useState(false);
  const [people, setPeople] = useState([]);

  useEffect(() => {
    setIsFetching(true);
    const fetchUser = async () => {
      const res = await axios
        .get(
          `https://api-metabook-by-mahbub.onrender.com/api/users/peopleMayKnow/${loggedInUser?._id}`,
          {
            headers: {
              "Content-Type": "application/json",
              token: `Bearer ${loggedInUser?.token}`,
            },
          }
        )
        .catch(function (error) {
          if (error.response || error.message) {
          }
        });
      if (res?.data) {
        setPeople(res.data);
        setIsFetching(false);
      }
    };
    loggedInUser?._id && loggedInUser?.token && fetchUser();
  }, [loggedInUser?._id, loggedInUser?.token]);

  return (
    <>
      <h4 className={styles.sidebarText}>People you may know</h4>
      <ul className={styles.sidebarFriendList}>
        {isFetching ? (
          <LoadingBar />
        ) : (
          <>
            {people.length > 0 &&
              people.map((people, index) => (
                <SuggestionFriend key={index} user={people} />
              ))}
          </>
        )}
      </ul>
    </>
  );
};

export default PeopleMayKnow;

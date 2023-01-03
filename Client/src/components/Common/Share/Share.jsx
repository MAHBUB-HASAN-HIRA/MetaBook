import { CircularProgress } from "@material-ui/core";
import { Cancel, Label, PermMedia } from "@material-ui/icons";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import InputEmoji from "react-input-emoji";
import { AuthContext } from "../../../Context/AuthContext";
import TagFriend from "../Helper/TagFriend/TagFriend";
import styles from "./share.module.scss";

const Share = ({ posts, setPosts }) => {
  const { loggedInUser } = useContext(AuthContext);
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [posting, setPosting] = useState(false);
  const [tagFriends, setTagFriends] = useState([]);
  const [tagModal, setTagModal] = useState(false);
  const [allFriends, setAllFriends] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    file?.name && formData.append("file", file);
    formData.append("desc", desc);
    formData.append("userId", loggedInUser?._id);
    formData.append("tags", JSON.stringify(tagFriends));

    try {
      if (desc?.length || file?.name) {
        setPosting(true);
        const res = await axios
          .post(
            "https://api-metabook-by-mahbub.onrender.com/api/posts",
            formData,
            {
              headers: {
                "content-type": "multipart/form-data",
                token: `Bearer ${loggedInUser?.token}`,
              },
            }
          )
          .catch(function (error) {
            if (error.response || error.message) {
              setPosting(false);
            }
          });
        if (!res?.data?.error && res.data.post) {
          setPosting(false);
          setDesc("");
          setFile(null);
          setPosts([res?.data?.post, ...posts]);
        }
      }
    } catch (error) {}
  };

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
        friendsList?.data?.length > 0 && setAllFriends([...friendsList.data]);
        setIsFetching(false);
      } catch (error) {
        setIsFetching(false);
      }
    };
    loggedInUser?._id && getFriends();
  }, [loggedInUser?._id, loggedInUser?.token]);

  return (
    <div className={styles.share}>
      <div className={styles.shareWrapper}>
        <div className={styles.shareTop}>
          <img
            loading="lazy"
            className={styles.shareProfileImg}
            src={loggedInUser?.profilePicture}
            alt=""
          />
          <InputEmoji
            className={styles.shareInput}
            placeholder={`What's in your mind ${loggedInUser?.fullName}?`}
            type="text"
            value={desc}
            onChange={setDesc}
            onResize={false}
            borderColor={"#ffffff"}
            fontSize={16}
          />
        </div>
        <hr className={styles.shareHr} />

        {file && (
          <div className={styles.shareImgContainer}>
            <img
              src={URL.createObjectURL(file)}
              className={styles.shareImg}
              alt=""
            />
            <Cancel
              className={styles.shareCancel}
              onClick={() => setFile(null)}
            />
          </div>
        )}

        <form className={styles.shareBottom} onSubmit={submitHandler}>
          <div className={styles.shareOptions}>
            <label htmlFor="file" className={styles.shareOption}>
              <PermMedia htmlColor="tomato" className={styles.shareIcon} />
              <span className={styles.shareOptionText}>Photo or Video</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                multiple={false}
                onChange={(e) => setFile(e.target.files[0])}
                accept=".png,.jpeg,.jpg"
              />
            </label>
            <div
              onClick={() => setTagModal(!tagModal)}
              className={styles.shareOption}
            >
              <Label htmlColor="blue" className={styles.shareIcon} />
              <span className={styles.shareOptionText}>Tag</span>
            </div>
          </div>
          <button type="submit" className={styles.shareButton}>
            Share {posting && <CircularProgress color="inherit" size="10px" />}
          </button>
          {tagModal && (
            <TagFriend
              tagModal={tagModal}
              setTagModal={setTagModal}
              tagFriends={tagFriends}
              setTagFriends={setTagFriends}
              allFriends={allFriends}
              setAllFriends={setAllFriends}
              isFetching={isFetching}
              setIsFetching={setIsFetching}
            />
          )}
        </form>
      </div>
    </div>
  );
};

export default Share;

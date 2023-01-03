import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import LoadingBar from "../Helper/LoadingBar/LoadingBar";
import Post from "../Post/Post";
import Share from "../Share/Share";
import styles from "./feed.module.scss";

const Feed = ({ profile, username, home }) => {
  const [isFetching, setIsFetching] = useState(false);
  const { loggedInUser, allPosts, setAllPosts, posts, setPosts } =
    useContext(AuthContext);

  const fetchPost = async (url) => {
    setIsFetching(true);
    const res = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        token: `Bearer ${loggedInUser?.token}`,
      },
    });
    if (Array.isArray(res.data)) {
      setIsFetching(false);
      setAllPosts(
        res.data?.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    }
  };

  useEffect(() => {
    let url = "";
    if (profile) {
      url = `https://api-metabook-by-mahbub.onrender.com/api/posts/profile/${username}`;
    }
    if (home && loggedInUser?._id) {
      url = `https://api-metabook-by-mahbub.onrender.com/api/posts/timeline/${loggedInUser?._id}`;
    }
    fetchPost(url);
  }, [home, profile, loggedInUser?._id, loggedInUser?.token, username]);

  useEffect(() => {
    setPosts(
      allPosts?.sort((p1, p2) => {
        return new Date(p2.createdAt) - new Date(p1.createdAt);
      })
    );
  }, [allPosts]);

  return (
    <div className={styles.feed}>
      <div className={styles.feedWrapper}>
        {profile
          ? username === loggedInUser?.username && (
              <Share posts={posts} setPosts={setPosts} />
            )
          : loggedInUser?._id && <Share posts={posts} setPosts={setPosts} />}
        {isFetching ? (
          <LoadingBar />
        ) : (
          <>
            {posts.length > 0 ? (
              posts.map((post) => (
                <Post profile={profile} key={post._id} post={post} />
              ))
            ) : (
              <div className={styles.noPost}>
                <h1>There is no post</h1>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Feed;

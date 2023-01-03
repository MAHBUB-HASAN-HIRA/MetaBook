import { Button, CircularProgress } from "@material-ui/core";
import { CheckCircleOutline, Close } from "@material-ui/icons";
import axios from "axios";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../../../Context/AuthContext";
import styles from "./UpdateDescription.module.scss";

const UpdateDescription = ({ defaultBio, setOpen }) => {
  const { loggedInUser, fetchState, dispatchDataLoad } =
    useContext(AuthContext);
  const [bio, setBio] = useState(defaultBio);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleDescUpdate = async () => {
    if (bio?.length > 0) {
      setError("");
      if (defaultBio !== bio) {
        setError("");
        dispatchDataLoad({ type: "DATA_FETCHING_START" });
        const res = await axios
          .put(
            `https://api-metabook-by-mahbub.onrender.com/api/users/${loggedInUser?._id}`,
            {
              desc: bio,
              userId: loggedInUser?._id,
            },
            {
              headers: {
                "Content-Type": "application/json",
                token: `Bearer ${loggedInUser?.token}`,
              },
            }
          )
          .catch(function (error) {
            if (error.response || error.message) {
              setSuccess(false);
              setError("OOPS!! Their is something wrong. Please try latter.");
              dispatchDataLoad({ type: "DATA_FETCHING_FAILURE" });
            }
          });
        if (!res?.data?.error && res?.data?.message) {
          setBio("");
          setError("");
          setSuccess(true);
          dispatchDataLoad({ type: "DATA_FETCHING_SUCCESS" });
          window.location.reload();
        }
      } else {
        setError("Bio can't be same.");
        setSuccess(false);
      }
    } else {
      setError("Please type your bio first.");
      setSuccess(false);
    }
  };
  return (
    <div className={styles.bioChange}>
      <div className={styles.container}>
        <span className={styles.error}>
          {bio?.length === 100 && "Max 100 character are allowed."}
          {error?.length > 0 && error}
        </span>
        <span className={styles.success}>
          {success && "Your bio successfully updated"}
        </span>
        <div className={styles.bioContainer}>
          <textarea
            defaultValue={bio}
            type="text"
            maxLength="100"
            placeholder="Type your bio."
            onChange={(e) => setBio(e.target.value)}
          />
          <span>{bio?.length ? bio?.length : "0"} /100</span>
        </div>
        <div className={styles.btnContainer}>
          <Button
            className={styles.cancel}
            onClick={() => setOpen(false)}
            variant="contained"
          >
            Cancel <Close />
          </Button>
          <Button
            onClick={handleDescUpdate}
            className={styles.update}
            variant="contained"
            disabled={fetchState.isFetching}
          >
            update{" "}
            {fetchState.isFetching ? (
              <CircularProgress color="inherit" size="20px" />
            ) : (
              <CheckCircleOutline />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UpdateDescription;

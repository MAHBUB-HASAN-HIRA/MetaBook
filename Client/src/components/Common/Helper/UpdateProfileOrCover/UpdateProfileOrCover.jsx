import { Button, CircularProgress } from "@material-ui/core";
import {
	Cancel,
	CheckCircleOutline,
	Close,
	PermMedia,
} from "@material-ui/icons";
import axios from "axios";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../../../Context/AuthContext";
import styles from "./UpdateProfileOrCover.module.scss";

const UpdateProfileOrCover = ({ profile, setOpen, cover }) => {
	const { loggedInUser, fetchState, dispatchDataLoad } =
		useContext(AuthContext);
	const [file, setFile] = useState(null);
	const [message, setMessage] = useState("");

	const handleUpload = async () => {
		const formData = new FormData();
		formData.append("file", file);
		formData.append("userId", loggedInUser?._id);
		profile && !cover && formData.append("profilePicture", "profilePicture");
		cover && !profile && formData.append("coverPicture", "coverPicture");

		dispatchDataLoad({ type: "DATA_FETCHING_START" });

		const res = await axios
			.post(
				`https://metabook-by-mahbub-server.herokuapp.com/api/users/profileImage/${loggedInUser?._id}`,
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
					setMessage("OOPS!! Their is something wrong. Please try latter.");
					dispatchDataLoad({ type: "DATA_FETCHING_FAILURE" });
				}
			});
		if (!res?.data?.error) {
			setMessage("");
			dispatchDataLoad({ type: "DATA_FETCHING_SUCCESS" });
			window.location.reload();
		}
	};

	return (
		<div
			style={{ height: file ? "500px" : "300px" }}
			className={styles.UpdateProfileOrCover}
		>
			<div className={styles.wrapper}>
				<div className={styles.top}>
					<p className={styles.message}>{message}</p>
					<div className={styles.photoContainer}>
						<label htmlFor="profileFile">
							Select your {profile ? "profile" : "cover"} picture
						</label>
						<label htmlFor="profileFile" className={styles.shareOption}>
							<PermMedia htmlColor="tomato" className={styles.shareIcon} />
							<span className={styles.shareOptionText}>upload</span>
							<input
								style={{ display: "none" }}
								type="file"
								id="profileFile"
								multiple={false}
								onChange={(e) => setFile(e.target.files[0])}
								accept=".png,.jpeg,.jpg"
							/>
						</label>
					</div>
				</div>
				{file && (
					<div className={styles.shareImgContainer}>
						<img
							src={URL.createObjectURL(file)}
							className={
								profile
									? styles.shareProfileImg + " " + styles.shareImg
									: styles.shareImg
							}
							alt=""
						/>
						<Cancel
							className={styles.shareCancel}
							onClick={() => setFile(null)}
						/>
					</div>
				)}
				{file?.name && (
					<div className={styles.bottom}>
						<Button
							variant="contained"
							className={styles.cancel}
							onClick={() => setOpen(false)}
						>
							Cancel <Close />
						</Button>
						<Button
							onClick={handleUpload}
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
				)}
			</div>
		</div>
	);
};

export default UpdateProfileOrCover;

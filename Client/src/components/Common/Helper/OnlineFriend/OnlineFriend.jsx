import React from "react";
import { Link } from "react-router-dom";
import styles from "./OnlineFriend.module.scss";

const OnlineFriend = ({ user }) => {
	return (
		<li className={styles.rightBarFriend}>
			<div className={styles.rightBarProfileImgContainer}>
				<img
					loading="lazy"
					src={user?.profilePicture}
					className={styles.rightBarProfileImg}
					alt=""
				/>
				<span className={styles.rightBarOnline}></span>
			</div>
			<Link to="/messenger" className={styles.rightBarUsername}>
				{user?.username}
			</Link>
		</li>
	);
};

export default OnlineFriend;

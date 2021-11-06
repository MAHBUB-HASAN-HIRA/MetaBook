import { Avatar, CircularProgress } from "@material-ui/core";
import axios from "axios";
import React, { useState } from "react";
import InputEmoji from "react-input-emoji";
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import styles from "./comment.module.scss";

const Comment = ({ post, loggedInUser }) => {
	const [comment, setComment] = useState("");
	const [allComments, setAllComments] = useState([...post?.comment]);
	const [fetching, setIsFetching] = useState(false);

	const comments = {
		userId: loggedInUser?._id,
		commentText: comment,
		profilePicture: loggedInUser?.profilePicture,
		username: loggedInUser?.username,
		fullName: loggedInUser?.fullName,
		commentDate: new Date(),
	};
	const handleComment = async () => {
		if (comment?.length) {
			setIsFetching(true);
			const res = await axios
				.put(
					`https://metabook-by-mahbub-server.herokuapp.com/api/posts/comment/${post?._id}`,
					{
						comment: comments,
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
						setIsFetching(false);
					}
				});
			if (!res?.data?.error) {
				setAllComments([...allComments, comments]);
				setComment("");
				setIsFetching(false);
			}
		}
	};

	return (
		<div className={styles.comment}>
			<div className={styles.commentWrapper}>
				<div className={styles.commentTop}>
					<div className={styles.commentImg}>
						<img
							alt={loggedInUser.fullName}
							src={loggedInUser.profilePicture}
							className={styles.postProfileImgProfile}
						/>
						<span>
							{loggedInUser.fullName}{" "}
							{fetching && <CircularProgress color="inherit" size="15px" />}
						</span>
					</div>
					<div className={styles.commentInput}>
						<InputEmoji
							className={styles.shareInput}
							placeholder={`Write a comment...`}
							type="text"
							value={comment}
							onChange={setComment}
							onResize={false}
							fontSize={16}
							onEnter={handleComment}
						/>
					</div>
				</div>
				<div className={styles.commentBottom}>
					{allComments.map((comment, index) => (
						<div className={styles.commentBottomDiv} key={index + 1.2}>
							<div className={styles.avatarContainer}>
								<Avatar
									alt={comment?.fullName}
									src={comment?.profilePicture}
									className={styles.avatar}
								/>
								<Link
									className={styles.name}
									to={`/profile/${comment?.username}`}
								>
									{comment?.fullName}
								</Link>
								<span className={styles.time}>
									{format(comment?.commentDate)}
								</span>
							</div>
							<div className={styles.textContent}>{comment?.commentText}</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Comment;

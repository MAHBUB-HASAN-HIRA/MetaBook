import { Avatar, CircularProgress } from "@material-ui/core";
import { Close, HighlightOff } from "@material-ui/icons";
import React from "react";
import styles from "./TagFriend.module.scss";

const TagFriend = ({
	tagModal,
	setTagModal,
	tagFriends,
	setTagFriends,
	allFriends,
	setAllFriends,
	isFetching,
}) => {
	const handleSelect = (friend) => {
		setTagFriends([
			...tagFriends,
			{
				userId: friend?._id,
				username: friend?.username,
				fullName: friend?.fullName,
				profilePicture: friend?.profilePicture,
			},
		]);

		const existing = allFriends.filter((user) => user?._id !== friend?._id);
		setAllFriends(existing);
	};

	const handleUnSelect = (user) => {
		const existing = tagFriends.filter(
			(unSelect) => unSelect?.userId !== user?.userId
		);

		setTagFriends(existing);
		setAllFriends([
			...allFriends,
			{
				_id: user?.userId,
				username: user?.username,
				fullName: user?.fullName,
				profilePicture: user?.profilePicture,
			},
		]);
	};

	return (
		<div className={styles.TagFriend}>
			<div className={styles.wrapper}>
				<div className={styles.closeDiv}>
					<Close
						className={styles.close}
						onClick={() => setTagModal(!tagModal)}
					/>
				</div>
				{tagFriends.length > 0 && <p>{tagFriends.length} Friends Selected</p>}
				{tagFriends.length > 0 &&
					tagFriends.map((friend) => (
						<div
							key={friend?.profilePicture}
							className={styles.friendsContainer}
						>
							<div className={styles.singleFriend}>
								<Avatar
									className={styles.avatar}
									src={friend?.profilePicture}
								/>
								<span style={{ cursor: "default" }}>{friend?.fullName}</span>
							</div>
							<div>
								<HighlightOff
									style={{ cursor: "pointer" }}
									onClick={() => handleUnSelect(friend)}
								/>
							</div>
						</div>
					))}
				{isFetching ? (
					<div className={styles.loading}>
						<CircularProgress className={styles.loading} size="30px" />
					</div>
				) : (
					<>
						{" "}
						{allFriends.length > 0 && <p>{allFriends.length} Friends Exist.</p>}
						{allFriends.length > 0 ? (
							allFriends.map((friend) => (
								<div key={friend?.username} className={styles.friendsContainer}>
									<div className={styles.singleFriend}>
										<Avatar
											className={styles.avatar}
											src={friend?.profilePicture}
										/>
										<span onClick={() => handleSelect(friend)}>
											{friend?.fullName}
										</span>
									</div>
								</div>
							))
						) : (
							<h4 className={styles.noFriends}>You have no friends</h4>
						)}
					</>
				)}
			</div>
		</div>
	);
};

export default TagFriend;

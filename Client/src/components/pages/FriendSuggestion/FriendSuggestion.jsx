import React, { useContext } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import Feed from "../../Common/Feed/Feed";
import PeopleMayKnow from "../../Common/PeopleMayKnow/PeopleMayKnow";
import ProfilePicAndCover from "../../Common/ProfilePicAndCover/ProfilePicAndCover";
import ProfileRightBar from "../../Common/RightBar/ProfileRightBar/ProfileRightBar/ProfileRightBar";
import TopBar from "../../Common/TopBar/TopBar";
import styles from "./FriendSuggestion.module.scss";

const FriendSuggestion = () => {
	const { loggedInUser } = useContext(AuthContext);
	return (
		<div>
			<TopBar />
			<div className={styles.friendSuggestion}>
				<div className={styles.feed}>
					<Feed profile={false} home={true} username={loggedInUser?.username} />
				</div>
				<div className={styles.peopleKnow}>
					<PeopleMayKnow />
				</div>
				<div className={styles.rightBar}>
					<ProfilePicAndCover user={loggedInUser} />
					<ProfileRightBar user={loggedInUser} />
				</div>
			</div>
		</div>
	);
};

export default FriendSuggestion;

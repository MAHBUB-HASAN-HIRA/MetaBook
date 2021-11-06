import FollowingButton from "../FollowingButton/FollowingButton";
import UserFriends from "../UserFriends/UserFriends";
import UserInfo from "../UserInfo/UserInfo";

const ProfileRightBar = ({ user }) => {
	return (
		<>
			<FollowingButton user={user} />
			<UserInfo user={user} />
			<UserFriends user={user} />
		</>
	);
};

export default ProfileRightBar;

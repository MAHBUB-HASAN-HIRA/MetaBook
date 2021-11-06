import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { AuthContext } from "../../../Context/AuthContext";
import Feed from "../../Common/Feed/Feed";
import ProfilePicAndCover from "../../Common/ProfilePicAndCover/ProfilePicAndCover";
import ProfileRightBar from "../../Common/RightBar/ProfileRightBar/ProfileRightBar/ProfileRightBar";
import SideBar from "../../Common/SideBar/SideBar";
import TopBar from "../../Common/TopBar/TopBar";
import styles from "./profile.module.scss";

const Profile = () => {
	const { loggedInUser } = useContext(AuthContext);
	const [user, setUser] = useState({});
	const username = useParams()?.username;

	useEffect(() => {
		const fetchUser = async () => {
			const res = await axios
				.get(
					`https://metabook-by-mahbub-server.herokuapp.com/api/users?username=${username}`,
					{
						headers: {
							"Content-Type": "application/json",
							token: `Bearer ${loggedInUser?.token}`,
						},
					}
				)
				.catch(function (error) {
					if (error.response || error.message) {
						setUser(error.response.data);
					}
				});
			res?.data && setUser(res.data);
		};
		username && loggedInUser?.token && fetchUser();
	}, [username, loggedInUser?.token]);

	return (
		<>
			<TopBar />
			<div className={styles.profile}>
				<SideBar />
				<div className={styles.profileRight}>
					{user?.error ? (
						<div className={styles.errorDiv}>
							<h1>{user?.message}</h1>
						</div>
					) : (
						<ProfilePicAndCover user={user} />
					)}
					{!user?.error && (
						<>
							<div className={styles.rightBarForMobile}>
								<ProfileRightBar user={user} />
							</div>
							<div className={styles.profileRightBottom}>
								<Feed profile={true} username={username} />

								<div className={styles.rightBarForDesktop}>
									<ProfileRightBar user={user} />
								</div>
							</div>
						</>
					)}
				</div>
			</div>
		</>
	);
};

export default Profile;

import { Button } from "@material-ui/core";
import {
	AccountCircle,
	ArrowDropDown,
	ArrowDropUp,
	Chat,
	Home,
	Notifications,
	PersonAddRounded,
	Search,
} from "@material-ui/icons";
import React, { useContext, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { AuthContext } from "../../../Context/AuthContext";
import Notification from "../Helper/Notification/Notification";
import styles from "./topBar.module.scss";

const TopBar = () => {
	const history = useHistory();
	const { loggedInUser, dispatch, allPosts, setPosts } =
		useContext(AuthContext);
	const [dropDown, setDropDown] = useState(false);
	const [notification, setNotification] = useState(false);
	const location = useLocation().pathname;

	const handleSearch = (e) => {
		if (e.target.value.length === 0) {
			setPosts(allPosts);
		}
		setPosts(
			allPosts.filter((post) =>
				post?.desc?.toLowerCase().includes(e.target.value.toLowerCase())
			)
		);
	
	};
	const handleLogout = () => {
		localStorage.removeItem("SSIID");
		dispatch({ type: "LOGIN_FAILURE" });
		history.push("/login");
	};

	return (
		<div className={styles.topBarContainer}>
			<div className={styles.topBarLeft}>
				<Link to="/" style={{ textDecoration: "none" }}>
					<span className={styles.logo}>MetaBook</span>
					<img
						src="https://i.ibb.co/MDygKd3/favicon.png"
						className={styles.facebookLogo}
						alt=""
					/>
				</Link>
			</div>
			<div className={styles.topBarCenter}>
				<div className={styles.searchBar}>
					<Search className={styles.searchIcon} />
					<input
						type="search"
						placeholder="Search post or video"
						className={styles.searchInput}
						onChange={handleSearch}
					/>
				</div>
			</div>
			<div className={styles.topBarRight}>
				<div className={styles.topBarLinks}>
					<Link
						to="/"
						className={
							location === "/"
								? `${styles.topBarLink}  ${styles.topBarLinkActive}`
								: `${styles.topBarLink}`
						}
					>
						Homepage
					</Link>
					<Link
						to={`/profile/${loggedInUser?.username}`}
						className={
							location?.split("/")[1] === "profile"
								? `${styles.topBarLink}  ${styles.topBarLinkActive}`
								: `${styles.topBarLink}`
						}
					>
						Timeline
					</Link>
				</div>
				<div className={styles.topBarIcons}>
					<div
						className={
							location === "/"
								? `${styles.topBarIconItem} ${styles.topBarIconItemForMobile} ${styles.topBarIconItemActive}`
								: `${styles.topBarIconItem} ${styles.topBarIconItemForMobile}`
						}
					>
						<Link to={`/`}>
							<Home />
						</Link>
					</div>
					<div
						className={
							location === "/friends/suggestion"
								? `${styles.topBarIconItem} ${styles.topBarIconItemActive}`
								: `${styles.topBarIconItem} `
						}
					>
						<Link to="/friends/suggestion">
							<PersonAddRounded />
						</Link>
					</div>
					<div
						className={
							location?.split("/")[1] === "profile"
								? `${styles.topBarIconItem} ${styles.topBarIconItemForMobile} ${styles.topBarIconItemActive}`
								: `${styles.topBarIconItem} ${styles.topBarIconItemForMobile}`
						}
					>
						<Link to={`/profile/${loggedInUser?.username}`}>
							<AccountCircle />
						</Link>
					</div>
					<div
						className={
							location === "/messenger"
								? `${styles.topBarIconItem} ${styles.topBarIconItemActive}`
								: `${styles.topBarIconItem} `
						}
					>
						<Link to={`/messenger`}>
							<Chat />
						</Link>
						<span className={styles.topBarIconBadge}>1</span>
					</div>
					<div className={styles.topBarIconItem}>
						<Notifications onClick={() => setNotification(!notification)} />
					</div>
				</div>
				<div className={styles.topBarImgContainer}>
					<Link to={`/profile/${loggedInUser?.username}`}>
						<img
							loading="lazy"
							src={loggedInUser?.profilePicture}
							alt=""
							className={styles.topBarImg}
						/>
					</Link>
					<span onClick={() => setDropDown(!dropDown)}>
						{dropDown ? (
							<ArrowDropDown className={styles.dropDown} />
						) : (
							<ArrowDropUp className={styles.dropDown} />
						)}
					</span>
					{dropDown && (
						<div className={styles.logoutBtn}>
							<Button onClick={handleLogout} variant="contained">
								Logout
							</Button>
						</div>
					)}
				</div>
				{notification && (
					<Notification
						notification={notification}
						setNotification={setNotification}
					/>
				)}
			</div>
		</div>
	);
};

export default TopBar;

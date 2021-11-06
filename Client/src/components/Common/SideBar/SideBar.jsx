import {
	Bookmark,
	Chat,
	Event,
	Group,
	HelpOutline,
	PlayCircleFilled,
	RssFeed,
	School,
	WorkOutline,
} from "@material-ui/icons";
import React from "react";
import PeopleMayKnow from "../PeopleMayKnow/PeopleMayKnow";
import styles from "./sidebar.module.scss";

const SideBar = () => {
	return (
		<div className={styles.sideBar}>
			<div className={styles.sideBarWrapper}>
				<ul className={styles.sideBarList}>
					<li className={styles.sideBarListItem}>
						<RssFeed className={styles.sideBarIcon} />
						<span className={styles.sideBarListItemText}>Feed</span>
					</li>
					<li className={styles.sideBarListItem}>
						<Chat className={styles.sideBarIcon} />
						<span className={styles.sideBarListItemText}>Chats</span>
					</li>
					<li className={styles.sideBarListItem}>
						<PlayCircleFilled className={styles.sideBarIcon} />
						<span className={styles.sideBarListItemText}>Videos</span>
					</li>
					<li className={styles.sideBarListItem}>
						<Group className={styles.sideBarIcon} />
						<span className={styles.sideBarListItemText}>Groups</span>
					</li>
					<li className={styles.sideBarListItem}>
						<Bookmark className={styles.sideBarIcon} />
						<span className={styles.sideBarListItemText}>Bookmarks</span>
					</li>
					<li className={styles.sideBarListItem}>
						<HelpOutline className={styles.sideBarIcon} />
						<span className={styles.sideBarListItemText}>Questions</span>
					</li>
					<li className={styles.sideBarListItem}>
						<WorkOutline className={styles.sideBarIcon} />
						<span className={styles.sideBarListItemText}>Jobs</span>
					</li>
					<li className={styles.sideBarListItem}>
						<Event className={styles.sideBarIcon} />
						<span className={styles.sideBarListItemText}>Events</span>
					</li>
					<li className={styles.sideBarListItem}>
						<School className={styles.sideBarIcon} />
						<span className={styles.sideBarListItemText}>Courses</span>
					</li>
				</ul>
				<button className={styles.sidebarButton}>Show More</button>
				<hr className={styles.sidebarHr} />
				<PeopleMayKnow />
			</div>
		</div>
	);
};

export default SideBar;

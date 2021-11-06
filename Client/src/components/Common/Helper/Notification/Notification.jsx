import { Close } from "@material-ui/icons";
import React from "react";
import styles from "./Notification.module.scss";

const Notification = ({ notification, setNotification }) => {
	return (
		<div className={styles.notification}>
			<div className={styles.wrapper}>
				<Close
					onClick={() => setNotification(!notification)}
					className={styles.close}
				/>
				<h1>You Have no notifications</h1>
			</div>
		</div>
	);
};

export default Notification;

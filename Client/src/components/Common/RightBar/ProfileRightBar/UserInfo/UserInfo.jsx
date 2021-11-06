import { CreateTwoTone } from "@material-ui/icons";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../../../../Context/AuthContext";
import EventModal from "../../../Helper/EventModal/EventModal";
import UpdateInfo from "../../../Helper/UpdateInfo/UpdateInfo";
import styles from "./UserInfo.module.scss";

const UserInfo = ({ user }) => {
	const { loggedInUser } = useContext(AuthContext);
	const [infoUpdate, setInfoUpdate] = useState(false);
	return (
		<div className={styles.infoWrapper}>
			<h4 className={styles.rightBarTitle}>
				User information{" "}
				{user?._id === loggedInUser?._id && (
					<CreateTwoTone
						onClick={() => setInfoUpdate(!infoUpdate)}
						style={{
							display: loggedInUser?._id ? "" : "none",
							cursor: "pointer",
							marginLeft: "10px",
						}}
					/>
				)}
			</h4>
			<div className={styles.rightBarInfo}>
				<div className={styles.rightBarInfoItem}>
					<span className={styles.rightBarInfoKey}>City:</span>
					<span className={styles.rightBarInfoValue}>{user?.city}</span>
				</div>
				<div className={styles.rightBarInfoItem}>
					<span className={styles.rightBarInfoKey}>From:</span>
					<span className={styles.rightBarInfoValue}>{user?.from}</span>
				</div>
				<div className={styles.rightBarInfoItem}>
					<span className={styles.rightBarInfoKey}>Gender:</span>
					<span className={styles.rightBarInfoValue}>{user?.gender}</span>
				</div>
				<div className={styles.rightBarInfoItem}>
					<span className={styles.rightBarInfoKey}>Relationship:</span>
					<span className={styles.rightBarInfoValue}>{user?.relationship}</span>
				</div>
			</div>
			<EventModal open={infoUpdate} setOpen={setInfoUpdate}>
				<UpdateInfo user={user} setOpen={setInfoUpdate} />
			</EventModal>
		</div>
	);
};

export default UserInfo;

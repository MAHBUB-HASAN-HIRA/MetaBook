import { CameraAlt, CreateTwoTone } from "@material-ui/icons";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import EventModal from "../Helper/EventModal/EventModal";
import LoadingBar from "../Helper/LoadingBar/LoadingBar";
import UpdateDescription from "../Helper/UpdateDescription/UpdateDescription";
import UpdateProfileOrCover from "../Helper/UpdateProfileOrCover/UpdateProfileOrCover";
import styles from "./ProfilePicAndCover.module.scss";

const ProfilePicAndCover = ({ user }) => {
	const { loggedInUser } = useContext(AuthContext);
	const [bioModal, setBioOpen] = useState(false);
	const [openProfileModal, setOpenProfileModal] = useState(false);
	const [openCoverModal, setOpenCoverModal] = useState(false);

	return (
		<div className={styles.profileRightTop}>
			{user?._id ? (
				<div className={styles.profileCover}>
					<div className={styles.profileCoverContainer}>
						<img
							loading="lazy"
							src={user?.coverPicture}
							className={styles.profileCoverImg}
							alt=""
						/>
						{user?._id === loggedInUser?._id && (
							<div
								title="Change cover pic"
								onClick={(e) => setOpenCoverModal(!openCoverModal)}
								className={styles.cameraIcon}
							>
								<span>
									<CameraAlt />
								</span>
							</div>
						)}
					</div>
					<EventModal open={openCoverModal} setOpen={setOpenCoverModal}>
						<UpdateProfileOrCover
							profile={false}
							cover={true}
							setOpen={setOpenCoverModal}
							loggedInUser={loggedInUser}
						/>
					</EventModal>
					<div className={styles.profilePicContainer}>
						<img
							loading="lazy"
							src={user?.profilePicture}
							className={styles.profileUserImg}
							alt=""
						/>
						{user?._id === loggedInUser?._id && (
							<div
								title="Change profile pic"
								className={styles.cameraIcon}
								onClick={(e) => setOpenProfileModal(!openProfileModal)}
							>
								<span>
									<CameraAlt />
								</span>
							</div>
						)}
						<EventModal open={openProfileModal} setOpen={setOpenProfileModal}>
							<UpdateProfileOrCover
								profile={true}
								cover={false}
								setOpen={setOpenProfileModal}
								loggedInUser={loggedInUser}
							/>
						</EventModal>
					</div>
				</div>
			) : (
				<LoadingBar />
			)}
			<div className={styles.profileInfo}>
				<h4 className={styles.profileInfoName}>{user?.fullName}</h4>
				<div className={styles.profileInfoDesc}>
					<p>
						{user?.desc}{" "}
						{user?._id === loggedInUser?._id && (
							<CreateTwoTone
								style={{
									display: loggedInUser?._id ? "block" : "none",
									cursor: "pointer",
									marginLeft: "10px",
								}}
								onClick={() => setBioOpen(!bioModal)}
							/>
						)}
					</p>
				</div>
				<div className={styles.followerInfo}>
					<span>{user?.followers?.length} Followers</span>
					<span>{user?.followings?.length} Followings</span>
				</div>
				<EventModal open={bioModal} setOpen={setBioOpen}>
					<UpdateDescription setOpen={setBioOpen} defaultBio={user?.desc} />
				</EventModal>
			</div>
		</div>
	);
};

export default ProfilePicAndCover;

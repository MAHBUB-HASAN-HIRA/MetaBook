import { Button, CircularProgress } from "@material-ui/core";
import { CheckCircleOutline, Close } from "@material-ui/icons";
import axios from "axios";
import React, { useContext, useRef, useState } from "react";
import { AuthContext } from "../../../../Context/AuthContext";
import styles from "./UpdateInfo.module.scss";

const UpdateInfo = ({ setOpen, user }) => {
	const { loggedInUser } = useContext(AuthContext);
	const [error, setError] = useState(false);
	const [isFetching, setIsFetching] = useState(false);
	const [relation, setRelation] = useState(user.relation);
	const [gender, setGender] = useState(user.gender);
	const cityRef = useRef();
	const fromTownRef = useRef();

	const handleUpdateInfo = async () => {
		setError("");
		setIsFetching(true);
		const res = await axios
			.put(
				`https://metabook-by-mahbub-server.herokuapp.com/api/users/${loggedInUser?._id}`,
				{
					city: cityRef.current.value,
					from: fromTownRef.current.value,
					gender: gender,
					relationship: relation,
					userId: loggedInUser?._id,
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
					setError(true);
				}
			});
		if (!res?.data?.error && res?.data?.message) {
			setError(false);
			setIsFetching(false);
			window.location.reload();
		}
	};

	return (
		<div className={styles.UpdateInfo}>
			<div className={styles.loginBox}>
				<p style={{ color: "red" }}>
					{error && "Their is some problemin updating . Please try again."}
				</p>

				<div className={styles.inputGroup}>
					<label htmlFor="city">City: </label>
					<input
						type="text"
						ref={cityRef}
						id="city"
						placeholder="Your home town"
						minLength="3"
						required
						defaultValue={user?.city}
					/>
				</div>
				<div className={styles.inputGroup}>
					<label htmlFor="fromWhere">From: </label>
					<input
						type="text"
						ref={fromTownRef}
						id="fromWhere"
						placeholder="Your current city"
						minLength="3"
						required
						defaultValue={user?.from}
					/>
				</div>
				<div className={styles.inputGroup}>
					<label htmlFor="relation">Relation Status:</label>
					<select
						className={styles.selectItem}
						onChange={(e) => setRelation(e.target.value)}
						id="relation"
						required
						defaultValue={relation}
					>
						<option value="Single">Single</option>
						<option value="Married ">Married </option>
					</select>
				</div>
				<div className={styles.inputGroup}>
					<label htmlFor="gender">Gender:</label>
					<select
						className={styles.selectItem}
						onChange={(e) => setGender(e.target.value)}
						id="gender"
						required
						defaultValue={gender}
					>
						<option value="Male">Male</option>
						<option value="Female">Female</option>
						<option value="Other">other</option>
					</select>
				</div>
				<div className={styles.bottom}>
					<Button
						variant="contained"
						className={styles.cancel}
						onClick={() => setOpen(false)}
					>
						Cancel <Close />
					</Button>
					<Button
						onClick={handleUpdateInfo}
						className={styles.update}
						variant="contained"
						disabled={isFetching}
					>
						update{" "}
						{isFetching ? (
							<CircularProgress
								className={styles.spin}
								color="inherit"
								size="20px"
							/>
						) : (
							<CheckCircleOutline />
						)}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default UpdateInfo;

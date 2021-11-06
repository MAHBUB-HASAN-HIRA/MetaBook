import { CircularProgress } from "@material-ui/core";
import React, { useContext, useRef, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { loginCall } from "../../../apiCalls";
import { AuthContext } from "../../../Context/AuthContext";
import styles from "./register.module.scss";

const Register = () => {
	const { isFetching, error, dispatch } = useContext(AuthContext);
	const [errorText, setErrorText] = useState(false);
	const [relation, setRelation] = useState("Single");
	const [gender, setGender] = useState("Male");
	const fullName = useRef();
	const username = useRef();
	const city = useRef();
	const fromTown = useRef();
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const history = useHistory();
	const location = useLocation();
	let { from } = location.state || { from: { pathname: "/" } };

	const handleRegister = async (e) => {
		e.preventDefault();
		if (confirmPassword !== password) {
			setErrorText(true);
		} else {
			setErrorText(false);
			const user = {
				fullName: fullName.current.value,
				username: username.current.value,
				password: password,
				city: city.current.value,
				from: fromTown.current.value,
				relationship: relation,
				gender: gender,
			};
			loginCall(
				{ ...user },
				"https://metabook-by-mahbub-server.herokuapp.com/api/auth/register",
				history,
				from,
				dispatch
			);
		}
	};

	return (
		<div className={styles.login}>
			<div className={styles.loginWrapper}>
				<div className={styles.loginLeft}>
					<h4 className={styles.loginLogo}>MetaBook</h4>
					<span className={styles.loginDesc}>
						Connect with friends and the world around you on MetaBook.
					</span>
				</div>
				<div className={styles.loginRight}>
					<form className={styles.loginBox} onSubmit={handleRegister}>
						<p style={{ color: "red" }}>
							{error &&
								"Their is some problem with register. Please try again."}
						</p>
						<input
							type="text"
							placeholder="Full Name"
							className={styles.loginInput}
							required
							minLength="6"
							maxLength="50"
							ref={fullName}
						/>
						<input
							type="text"
							placeholder="Username"
							className={styles.loginInput}
							minLength="6"
							maxLength="20"
							required
							ref={username}
						/>
						<input
							type="password"
							placeholder="Password"
							className={styles.loginInput}
							minLength="6"
							required
							onChange={(e) => setPassword(e.target.value)}
						/>
						<input
							type="password"
							placeholder="Password Again"
							className={styles.loginInput}
							minLength="6"
							required
							onChange={(e) => setConfirmPassword(e.target.value)}
						/>
						<p style={{ color: "red" }}>
							{errorText && "Password doesn't Matched"}
						</p>
						<div className={styles.infoContainer}>
							<div className={styles.infoTop}>
								<input
									type="text"
									ref={city}
									placeholder="Your home town"
									minLength="3"
									required
								/>
								<input
									type="text"
									ref={fromTown}
									placeholder="Your current city"
									minLength="3"
									required
								/>
							</div>
							<div className={styles.infoBottom}>
								<div className={styles.infoRelation}>
									<label htmlFor="relation">Relation Status</label>
									<select
										onChange={(e) => setRelation(e.target.value)}
										name=""
										id="relation"
										required
									>
										<option value="Single">Single</option>
										<option value="Married ">Married </option>
									</select>
								</div>
								<div className={styles.infoRelation}>
									<label htmlFor="gender">Gender</label>
									<select
										onChange={(e) => setGender(e.target.value)}
										name=""
										id="gender"
										required
									>
										<option value="Male">Male</option>
										<option value="Female">Female</option>
										<option value="Other">other</option>
									</select>
								</div>
							</div>
						</div>
						<button type="submit" className={styles.loginButton}>
							{isFetching ? (
								<CircularProgress color="inherit" size="20px" />
							) : (
								"Sign Up"
							)}
						</button>
						<hr style={{ marginBottom: "10px" }} />
						<Link to="/login" className={styles.loginRegisterButton}>
							Log into Account
						</Link>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Register;

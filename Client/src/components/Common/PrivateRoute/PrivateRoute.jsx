import jwt_decode from "jwt-decode";
import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import { AuthContext } from "../../../Context/AuthContext";

const PrivateRoute = ({ children, ...rest }) => {
	const { loggedInUser, dispatch } = useContext(AuthContext);

	const isLoggedIn = () => {
		const token = localStorage.getItem("SSIID");
		if (!token) {
			return false;
		}

		const decodedToken = jwt_decode(token);
		// get current time
		const currentTime = new Date().getTime() / 1000;
		// compare the expiration time with the current time
		// will return false if expired and will return true if not expired

		if (decodedToken.exp < currentTime) {
			dispatch({ type: "LOGIN_FAILURE", payload: {} });
			window.location.reload();
			localStorage.removeItem(`SSIID`);
		}

		return decodedToken.exp > currentTime;
	};

	return (
		<Route
			{...rest}
			render={({ location }) =>
				(loggedInUser?.username && loggedInUser?._id) || isLoggedIn() ? (
					children
				) : (
					<Redirect
						to={{
							pathname: "/login",
							state: { from: location },
						}}
					/>
				)
			}
		/>
	);
};

export default PrivateRoute;

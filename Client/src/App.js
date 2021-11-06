import axios from "axios";
import jwt_decode from "jwt-decode";
import React, { useContext, useEffect, useState } from "react";
import {
	BrowserRouter as Router,
	Redirect,
	Route,
	Switch,
} from "react-router-dom";
import PrivateRoute from "./components/Common/PrivateRoute/PrivateRoute";
import FriendSuggestion from "./components/pages/FriendSuggestion/FriendSuggestion";
import Home from "./components/pages/Home/Home";
import Login from "./components/pages/Login/Login";
import Messenger from "./components/pages/Messenger/Messenger/Messenger";
import MessengerForMobile from "./components/pages/MessengerForMobile/MessengerForMobile";
import NotFound from "./components/pages/NotFound/NotFound";
import Profile from "./components/pages/Profile/Profile";
import Register from "./components/pages/Register/Register";
import { AuthContext } from "./Context/AuthContext";

function App() {
	const { loggedInUser, dispatch } = useContext(AuthContext);
	const [small, setSmall] = useState(false);
	useEffect(() => {
		const token = localStorage.getItem("SSIID");
		if (token && token !== undefined && token !== null) {
			const userId = jwt_decode(token)?.data?._id;
			const fetchUser = async () => {
				const res = await axios
					.get(
						`https://metabook-by-mahbub-server.herokuapp.com/api/users?userId=${userId}`,
						{
							headers: {
								"Content-Type": "application/json",
								token: `Bearer ${token}`,
							},
						}
					)
					.catch(
						(err) =>
							err.response &&
							dispatch({
								type: "LOGIN_FAILURE",
								payload: { ...err },
							})
					);
				res?.data?._id &&
					dispatch({
						type: "LOGIN_SUCCESS",
						payload: { ...res?.data, token: token },
					});
			};
			userId && fetchUser();
		}
	}, [dispatch, loggedInUser?.token]);

	window.addEventListener("resize", () => {
		if (window.innerWidth < 768) {
			setSmall(true);
		} else {
			setSmall(false);
		}
	});
	useEffect(() => {
		if (window.innerWidth < 768) {
			setSmall(true);
		} else {
			setSmall(false);
		}
	}, []);
	return (
		<Router>
			<Switch>
				<PrivateRoute exact path="/">
					<Home />
				</PrivateRoute>
				<Route exact path="/login">
					{localStorage.getItem("SSIID") ? <Redirect to="/" /> : <Login />}
				</Route>
				<Route exact path="/register">
					{localStorage.getItem("SSIID") ? <Redirect to="/" /> : <Register />}
				</Route>
				<PrivateRoute exact path="/profile/:username">
					<Profile />
				</PrivateRoute>
				<PrivateRoute exact path="/friends/suggestion">
					<FriendSuggestion />
				</PrivateRoute>
				<PrivateRoute exact path="/messenger/">
					{!small ? <Messenger /> : <Redirect to="/messengerMobile" />}
				</PrivateRoute>
				<PrivateRoute exact path="/messengerMobile/">
					{small ? <MessengerForMobile /> : <Redirect to="/messenger" />}
				</PrivateRoute>
				<Route path="*">
					<NotFound />
				</Route>
			</Switch>
		</Router>
	);
}

export default App;

import axios from "axios";
import jwt_decode from "jwt-decode";
export const loginCall = async (
	userCredential,
	url,
	history,
	from,
	dispatch
) => {
	dispatch({ type: "LOGIN_START" });
	try {
		const res = await axios.post(url, userCredential);
		if (res?.data?.token) {
			localStorage.setItem("SSIID", res?.data?.token);
			const userData = await jwt_decode(res?.data?.token);
			dispatch({ type: "LOGIN_SUCCESS", payload: {...userData?.data, token: res?.data?.token} });
			history.replace(from);
		}
	} catch (error) {
		dispatch({ type: "LOGIN_FAILURE", payload: error });
	}
};

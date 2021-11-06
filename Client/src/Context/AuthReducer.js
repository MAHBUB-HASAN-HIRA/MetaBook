export const AuthReducer = (state, action) => {
	switch (action.type) {
		case "LOGIN_START":
			return {
				loggedInUser: {},
				isFetching: true,
				error: false,
			};

		case "LOGIN_SUCCESS":
			return {
				loggedInUser: action.payload,
				isFetching: false,
				error: false,
			};

		case "LOGIN_FAILURE":
			return {
				loggedInUser: {},
				isFetching: false,
				error: action.payload,
			};

		default:
			return state;
	}
};

export const DataLoadReducer = (state, action) => {
	switch (action.type) {
		case "DATA_FETCHING_START":
			return {
				isFetching: true,
				error: false,
			};

		case "DATA_FETCHING_SUCCESS":
			return {
				isFetching: false,
				error: false,
			};

		case "DATA_FETCHING_FAILURE":
			return {
				isFetching: false,
				error: true,
			};

		default:
			return state;
	}
};

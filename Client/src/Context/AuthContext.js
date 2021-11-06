import { createContext, useReducer } from "react";
import {AuthReducer, DataLoadReducer} from "./AuthReducer";

const INITIAL_STATE = {
	user: {},
	isFetching: false,
	error: false,
};

const INITIAL_DATA_LOAD_STATE = {
	isFetching: false,
	error: false,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
	const [fetchState, dispatchDataLoad] = useReducer(DataLoadReducer, INITIAL_DATA_LOAD_STATE);
	
	return (
		<AuthContext.Provider
			value={{
				loggedInUser: state.loggedInUser,
				isFetching: state.isFetching,
				error: state.error,
				dispatch: dispatch,
				dispatchDataLoad: dispatchDataLoad,
				fetchState: fetchState
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

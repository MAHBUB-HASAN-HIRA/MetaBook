import { CircularProgress } from "@material-ui/core";
import React from "react";

const LoadingBar = () => {
	const styles = {
		width: "100%",
		height: "50vh",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	};
	return (
		<div style={styles} className="Loading">
			<CircularProgress />
		</div>
	);
};

export default LoadingBar;

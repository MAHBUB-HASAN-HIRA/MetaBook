import React from "react";
import TopBar from "../../Common/TopBar/TopBar";

const NotFound = () => {
	return (
		<>
			<TopBar />
			<div
				style={{
					height: "calc(100vh - 50px)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<h1>Page Not Found</h1>
			</div>
		</>
	);
};

export default NotFound;

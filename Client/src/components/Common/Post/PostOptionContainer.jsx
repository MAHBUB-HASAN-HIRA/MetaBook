import { CircularProgress } from "@material-ui/core";
import { Delete, HighlightOff } from "@material-ui/icons";
import axios from "axios";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../../Context/AuthContext";

const PostOptionContainer = ({ post, styles, setHide, hide, user }) => {
	const { loggedInUser } = useContext(AuthContext);
	const [fetching, setFetching] = useState(false);

	const handleDelete = async () => {
		try {
			setFetching(true);
			const res = await axios
				.delete(
					`https://metabook-by-mahbub-server.herokuapp.com/api/posts/${post?._id}`,
					{
						headers: {
							"Content-Type": "application/json",
							token: `Bearer ${loggedInUser?.token}`,
							userid: loggedInUser?._id,
						},
					}
				)
				.catch((err) => err.response && setFetching(false));

			if (res?.data && !res?.data.error) {
				setFetching(false);
				setHide(!hide);
			}
		} catch (error) {
			setFetching(false);
		}
	};

	return (
		<div className={styles.optionContainer}>
			<button
				style={{ marginBottom: "5px" }}
				className={styles.optionsBtn}
				onClick={() => setHide(!hide)}
			>
				<HighlightOff className={styles.optionsBtnIcon} /> Hide
			</button>
			{user._id === loggedInUser._id && (
				<button onClick={handleDelete} className={styles.optionsBtn}>
					{fetching ? (
						<CircularProgress
							color="inherit"
							size="20px"
							className={styles.optionsBtnIcon}
						/>
					) : (
						<Delete className={styles.optionsBtnIcon} />
					)}{" "}
					Delete
				</button>
			)}
		</div>
	);
};

export default PostOptionContainer;

import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Avatar,
} from "@material-ui/core";
import { MoreHoriz, MoreVert } from "@material-ui/icons";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import { AuthContext } from "../../../Context/AuthContext";
import Comment from "../Helper/Comment/Comment";
import styles from "./post.module.scss";
import PostOptionContainer from "./PostOptionContainer";

const Post = ({ post, profile }) => {
	const [like, setLike] = useState(post.likes.length);
	const [isLiked, setIsLike] = useState(false);
	const [hide, setHide] = useState(false);
	const [more, setMore] = useState(false);
	const [user, setUser] = useState({});
	const { loggedInUser } = useContext(AuthContext);

	const likeHandler = () => {
		try {
			axios.put(
				`https://metabook-by-mahbub-server.herokuapp.com/api/posts/${post._id}/like`,
				{
					userId: loggedInUser?._id,
				},
				{
					headers: {
						"Content-Type": "application/json",
						token: `Bearer ${loggedInUser?.token}`,
					},
				}
			);
		} catch (error) {}
		setLike(isLiked ? like - 1 : like + 1);
		setIsLike(!isLiked);
	};

	useEffect(() => {
		setIsLike(post.likes.includes(loggedInUser?._id));
	}, [loggedInUser?._id, post.likes]);

	useEffect(() => {
		const fetchUser = async () => {
			const res = await axios
				.get(
					`https://metabook-by-mahbub-server.herokuapp.com/api/users?userId=${post.userId}`,
					{
						headers: {
							"Content-Type": "application/json",
							token: `Bearer ${loggedInUser?.token}`,
						},
					}
				)
				.catch((err) => err.response && console.log(err));
			res.data?._id && setUser(res.data);
		};
		post?.userId && fetchUser();
	}, [post?.userId, loggedInUser?.token]);

	return (
		<>
			{!hide && (
				<div className={styles.post}>
					<div className={styles.postWrapper}>
						<div className={styles.postTop}>
							<div className={styles.postTopLeft}>
								{profile ? (
									<>
										<Avatar
											alt={user?.fullName}
											loading="lazy"
											src={user?.profilePicture}
										/>
										<div className={styles.nameContainer}>
											<div className={styles.name}>
												<span className={styles.postUsernameProfile}>
													{user?.fullName}
												</span>
												{post?.tags?.length > 0 && (
													<span>
														is with
														<Link
															to={`/profile/${post.tags[0].username}`}
															className={styles.tagName}
														>
															{post.tags[0].fullName}
														</Link>
														{post?.tags?.length > 1 && (
															<>
																and
																<b
																	style={{ margin: "0 5px", fontSize: "16px" }}
																>
																	{post?.tags?.length - 1} others
																</b>
															</>
														)}
													</span>
												)}
											</div>
											<span className={styles.postDate}>
												{format(post.createdAt)}
											</span>
										</div>
									</>
								) : (
									<>
										<Link to={`profile/${user.username}`}>
											<img
												loading="lazy"
												src={user?.profilePicture}
												className={styles.postProfileImg}
												alt="user"
											/>
										</Link>
										<div className={styles.nameContainer}>
											<div className={styles.name}>
												<Link
													style={{ textDecoration: "none", color: "black" }}
													to={`profile/${user.username}`}
												>
													<span className={styles.postUsername}>
														{user?.fullName}
													</span>
												</Link>
												{post?.tags?.length > 0 && (
													<span>
														is with
														<Link
															to={`/profile/${post.tags[0].username}`}
															className={styles.tagName}
														>
															{post.tags[0].fullName}
														</Link>
														{post?.tags?.length > 1 && (
															<>
																and
																<b
																	style={{ margin: "0 5px", fontSize: "16px" }}
																>
																	{post?.tags?.length - 1} others
																</b>
															</>
														)}
													</span>
												)}
											</div>

											<span className={styles.postDate}>
												{format(post.createdAt)}
											</span>
										</div>
									</>
								)}
							</div>
							<div className={styles.postTopRight}>
								{more ? (
									<MoreHoriz
										onClick={() => setMore(!more)}
										className={styles.moreBtn}
									/>
								) : (
									<MoreVert
										onClick={() => setMore(!more)}
										className={styles.moreBtn}
									/>
								)}
								{more && (
									<PostOptionContainer
										setHide={setHide}
										styles={styles}
										hide={hide}
										user={user}
										post={post}
									/>
								)}
							</div>
						</div>
						<div className={styles.postCenter}>
							<span className={styles.postText}>{post?.desc}</span>
							<img
								loading="lazy"
								className={styles.postImg}
								src={post?.img}
								alt=""
							/>
						</div>
						<Accordion className={styles.accordion}>
							<div className={styles.postBottom}>
								<div className={styles.postBottomLeft}>
									<img
										loading="lazy"
										className={styles.likeIcon}
										onClick={likeHandler}
										src="https://i.ibb.co/dGjXFmg/like.png"
										alt=""
									/>
									<img
										loading="lazy"
										className={styles.likeIcon}
										onClick={likeHandler}
										src="https://i.ibb.co/30Jp89C/heart.png"
										alt=""
									/>
									<span className={styles.likeCounter}>{like} people</span>
								</div>
								<AccordionSummary aria-controls={post?._id} id={post?._id}>
									<div className={styles.postBottomRight}>
										<span className={styles.postCommentText}>
											{post?.comment?.length} comments
										</span>
									</div>
								</AccordionSummary>
							</div>
							<AccordionDetails>
								<hr />
								<Comment loggedInUser={loggedInUser} post={post} />
							</AccordionDetails>
						</Accordion>
					</div>
				</div>
			)}
		</>
	);
};

export default Post;

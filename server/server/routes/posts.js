const router = require("express").Router();
const Post = require("../models/Post.model");
const User = require("../models/User.model");
const { uploadImage } = require("../controller/imageUpload.controller");

//create a post
router.post("/", async (req, res) => {
	try {
		if (req?.files?.file) {
			await uploadImage(req.files.file)
				.then(async (response) => {
					if (response?.url) {
						const post = await Post.create({
							img: response?.url,
							desc: req.body?.desc,
							userId: req.body.userId,
							tags: JSON.parse(req.body.tags),
						});
						if (post?._id) {
							res.status(200).json({
								error: false,
								message: "New Post successfully created.",
								post: post,
							});
						}
					}
				})
				.catch((err) => {
					res.status(403).json({
						error: true,
						message: "There is some problem in crete a post.",
					});
				});
		} else if (req.body?.desc && !req?.files?.file) {
			const descPost = await Post.create({
				userId: req.body.userId,
				desc: req.body.desc,
				tags: JSON.parse(req.body.tags),
			});
			if (descPost?._id) {
				res.status(200).json({
					error: false,
					message: "New Post successfully created.",
					post: descPost,
				});
			}
		}
	} catch (error) {
		res
			.status(500)
			.json({ error: true, message: "Internal server error", ...error });
	}
});

//update a post
router.put("/:id", async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (post?.userId === req.body.userId) {
			await post.updateOne({ $set: req.body });
			res.status(200).json("post has been updated");
		} else {
			res.status(403).json("only you can update your post");
		}
	} catch (error) {
		res.status(500).json(error);
	}
});

//delete a post
router.delete("/:id", async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (post?.userId === req.headers.userid) {
			await post.deleteOne();
			res.status(200).json({ error: false, message: "post has been deleted" });
		} else {
			res
				.status(403)
				.json({ error: false, message: "only you can delete your post" });
		}
	} catch (error) {
		res.status(500).json({ error: true, ...error });
	}
});

//like || dislike a post
router.put("/:id/like", async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post.likes.includes(req.body.userId)) {
			await post.updateOne({ $push: { likes: req.body.userId } });
			res.status(200).json("The post has been liked");
		} else {
			await post.updateOne({ $pull: { likes: req.body.userId } });
			res.status(200).json("The post has been disliked");
		}
	} catch (error) {
		res.status(500).json(error);
	}
});

//comment a post
router.put("/comment/:id", async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (post?._id) {
			const updatePost = await Post.findByIdAndUpdate(
				post?._id,
				{ comment: [...post?.comment, req.body.comment] },
				{ new: true }
			);
			if (updatePost?._id) {
				res.status(200).json({ error: false, message: "comment created" });
			} else {
				res
					.status(304)
					.json({ error: true, message: "Their is something wrong." });
			}
		}
	} catch (error) {
		res.status(500).json(error);
	}
});

//get single post by id
router.get("/:id", async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		post?._id
			? res.status(200).json(post)
			: res.status(404).json("there is no post with this Id");
	} catch (error) {
		res.status(500).json(error);
	}
});

//user's timeline post
router.get("/timeline/:userId", async (req, res) => {
	try {
		const currentUser = await User.findById(req.params.userId);
		const userPosts = await Post.find({ userId: currentUser?._id });
		const friendPosts = await Promise.all(
			currentUser.followings.map(async (friendId) => {
				return await Post.find({ userId: friendId });
			})
		);
		res.status(200).json(userPosts.concat(...friendPosts));
	} catch (error) {
		res.status(500).json(error);
	}
});

//user's all post
router.get("/profile/:username", async (req, res) => {
	try {
		const currentUser = await User.findOne({ username: req.params.username });
		if (currentUser?._id) {
			const userPosts = await Post.find({ userId: currentUser?._id });
			res.status(200).json(userPosts);
		} else {
			res
				.status(400)
				.json({ error: true, message: "User not found with this id" });
		}
	} catch (error) {
		res.status(500).json({ error: true, message: "Their is some problem" });
	}
});

module.exports = router;

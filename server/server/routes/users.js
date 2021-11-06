const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User.model");
const { uploadImage } = require("../controller/imageUpload.controller");

//update user
router.put("/:id", async (req, res) => {
	try {
		if (req.body.userId === req.params.id) {			
			const user = await User.findByIdAndUpdate(req.body.userId, {
				$set: req.body,
			});
			if (user?._id) {
				res
					.status(200)
					.json({ error: false, message: "User successfully updated." });
			} else {
				res
					.status(403)
					.json({ error: true, message: "There is some problem in updating." });
			}
		} else {
			return res
				.status(403)
				.json({ error: true, message: "You can update only your account!" });
		}
	} catch (error) {
		return res.status(500).json(error);
	}
});

//upload user image
router.post("/profileImage/:id", async (req, res) => {
	try {
		if (req.body.userId === req.params.id) {
			if (!req.files || Object.keys(req.files).length === 0) {
				return res
					.status(400)
					.json({ error: true, message: "No files were uploaded." });
			} else {
				await uploadImage(req.files.file)
					.then(async (response) => {
						if (response?.url) {
							const data = req.body.profilePicture
								? {
										profilePicture: response.url,
								  }
								: {
										coverPicture: response.url,
								  };
							const user = await User.findByIdAndUpdate(req.body.userId, {
								$set: data,
							});
							if (user?._id) {
								res.status(200).json({
									error: false,
									message: "User successfully updated.",
								});
							}
						}
					})
					.catch((err) => {
						res.status(403).json({
							error: true,
							message: "There is some problem in updating.",
						});
					});
			}
		} else {
			return res
				.status(403)
				.json({ error: true, message: "You can update only your account!" });
		}
	} catch (error) {
		return res.status(500).json(error);
	}
});

//delete user
router.delete("/:id", async (req, res) => {
	if (req.body.userId === req.params.id || req.body.isAdmin) {
		if (req.body.password) {
			try {
				const user = await User.findByIdAndDelete(req.params.id);

				user?._id
					? res.status(200).json("Account has been deleted successfully")
					: res.status(400).json("There is some problem in deleting");
			} catch (error) {
				return res.status(500).json(error);
			}
		}
	} else {
		return res.status(403).json("You can delete only your account!");
	}
});

//get a user
router.get("/", async (req, res) => {
	try {
		const username = req.query?.username;
		const userId = req.query?.userId;

		const user = userId
			? await User.findById(userId)
			: await User.findOne({ username: username });
		if (user?.username && user?.fullName) {
			const { password, updatedAt, createdAt, __v, ...other } = user._doc;
			res.status(200).json(other);
		} else {
			res.status(404).json({ error: true, message: "User not founded" });
		}
	} catch (error) {
		return res.status(500).json({ error: true, message: error.message });
	}
});

//get my friends
router.get("/friends/:userId", async (req, res) => {
	try {
		const user = await User.findById(req.params.userId);
		const friends = await Promise.all(
			user.followings.map((friendId) => {
				return User.findById(friendId);
			})
		);

		let friendList = [];
		friends.map((friend) => {
			const { _id, username, profilePicture, fullName } = friend;
			friendList.push({ _id, username, profilePicture, fullName });
		});

		res.status(200).send(friendList);
	} catch (error) {
		return res.status(500).json(error);
	}
});

//get peopleMayKnow
router.get("/peopleMayKnow/:userId", async (req, res) => {
	try {
		let friendList = [];
		const user = await User.findById(req.params.userId);
		const friends = user?.followings;
		const allUsers = await User.find();
		friends.push(req.params.userId)
		const peoples = allUsers.filter((user) => friends.indexOf(user._id) === -1);
		peoples.map((people) => {
			const { _id, username, profilePicture, fullName } = people;
			friendList.push({ _id, username, profilePicture, fullName });
		});
		res.status(200).send(friendList);
	} catch (error) {
		return res.status(500).json(error);
	}
});

//follow a user
router.put("/:id/follow", async (req, res) => {
	if (req.body.userId !== req.params.id) {
		try {
			const user = await User.findById(req.params.id);
			const currentUser = await User.findById(req.body.userId);
			if (!user.followers.includes(req.body.userId)) {
				await user.updateOne({ $push: { followers: req.body.userId } });
				await currentUser.updateOne({ $push: { followings: req.params.id } });
				res.status(200).json("user has been followed");
			} else {
				res.status(403).json("You are already follow this user");
			}
		} catch (error) {
			res.status(500).json(error);
		}
	} else {
		res.status(403).json("You can't follow yourself");
	}
});

//unfollow a user
router.put("/:id/unfollow", async (req, res) => {
	if (req.body.userId !== req.params.id) {
		try {
			const user = await User.findById(req.params.id);
			const currentUser = await User.findById(req.body.userId);
			if (user.followers.includes(req.body.userId)) {
				await user.updateOne({ $pull: { followers: req.body.userId } });
				await currentUser.updateOne({ $pull: { followings: req.params.id } });
				res.status(200).json("user has been unfollowed");
			} else {
				res.status(403).json("You are don't follow this user");
			}
		} catch (error) {
			res.status(500).json(error);
		}
	} else {
		res.status(403).json("You can't unfollow yourself");
	}
});

module.exports = router;

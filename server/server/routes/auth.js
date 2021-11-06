const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../controller/jwt");

//Register
router.post("/register", async (req, res) => {
	try {
		//generate new password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(req.body.password, salt);

		//create new user
		const newUser = new User({
			fullName: req.body.fullName,
			username: req.body.username,
			password: hashedPassword,
			city: req.body.city,
			from: req.body.from,
			relationship: req.body.relationship,
			gender: req.body.gender,
		});

		//save user and return response
		const user = await newUser.save();
		const userObj = JSON.parse(JSON.stringify(user));
		delete userObj.password;
		delete userObj.createdAt;
		delete userObj.updatedAt;
		delete userObj.__v;

		const token = await generateToken(userObj);
		res.status(201).json({ token: token });
	} catch (error) {
		res.status(500).json(error);
	}
});

//LOGIN
router.post("/login", async (req, res) => {
	try {
		const user = await User.findOne({ username: req.body.username });
		if (!user?._id) {
			res.status(404).json({ error: true, message: "user not found" });
		} else {
			const validPassword = await bcrypt.compare(
				req.body.password,
				user.password
			);
			if (!validPassword) {
				res.status(400).json({ error: true, message: "password not matched" });
			} else {
				const userObj = JSON.parse(JSON.stringify(user));
				delete userObj.password;
				delete userObj.createdAt;
				delete userObj.updatedAt;
				delete userObj.__v;

				const token = await generateToken(userObj);

				user?._id && res.status(200).json({ token: token });
			}
		}
	} catch (error) {
		res.status(500).json(error);
	}
});

module.exports = router;

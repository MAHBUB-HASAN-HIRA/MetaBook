const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			require: true,
			min: 6,
			max: 20,
			unique: true,
			trim: true,
		},
		fullName: {
			type: String,
			require: true,
			max: 50,
			min: 3,
			trim: true,
		},
		password: {
			type: String,
			require: true,
			min: 6,
			trim: true,
		},
		profilePicture: {
			type: String,
			default: "https://i.ibb.co/JsYsVDc/noAvatar.png",
		},
		coverPicture: {
			type: String,
			default: "https://i.ibb.co/nsKhKXw/noCover.jpg",
		},
		followers: {
			type: Array,
			default: [],
		},

		followings: {
			type: Array,
			default: [],
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
		desc: {
			type: String,
			max: 50,
			trim: true,
		},
		city: {
			type: String,
			max: 50,
			trim: true,
		},
		from: {
			type: String,
			max: 50,
			trim: true,
		},
		relationship: {
			type: String,
			max: 10,
		},
		gender: {
			type: String,
			max: 10,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("User", UserSchema);

const jwt = require("jsonwebtoken");

const isAuthentication = async (req, res, next) => {
	try {	
		const verified = await jwt.verify(
			req?.headers?.token.split("Bearer ")[1],
			process.env.JWT_SECRET
		);

		if (!verified?.data || !verified?.data?._id) {
			return res.status(401).json({
				error: true,
				data: null,
				token: null,
				message: "user not authenticated",
			});
		}
		next();
	} catch (e) {
		return res.status(500).json({
			error: e.message,
			data: null,
			token: null,
			message: "something wrong in.",
		});
	}
};

const generateToken = async (userObj) => {
	const token = await jwt.sign(
		{
			data: userObj,
		},
		process.env.JWT_SECRET,
		{
			expiresIn: "30d",
		}
	);
	return token;
};

module.exports = { isAuthentication, generateToken };

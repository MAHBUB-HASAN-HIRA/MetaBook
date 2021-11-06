const router = require("express").Router();
const Conversation = require("../models/Conversation");

//new Conversation
router.post("/", async (req, res) => {
	try {
		const conversation = await Conversation.create({
			members: [req.body.senderId, req.body.receiverId],
		});
		if (conversation?._id) {
			res.status(201).json({ error: false, conversation });
		} else {
			res
				.status(404)
				.json({ error: true, message: "conversation cannot be created" });
		}
	} catch (error) {
		res.status(500).json({ error: true, ...error });
	}
});

//get Conversation
router.get("/:userId", async (req, res) => {
	try {
		const conversation = await Conversation.find({
			members: { $in: [req.params.userId] },
		});
		res.status(200).json({ error: false, conversation });
	} catch (error) {
		res.status(500).json({ error: true, ...error });
	}
});

//get conversation includes two userId
router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
	try {
		const conversation = await Conversation.findOne({
			members: { $all: [req.params.firstUserId, req.params.secondUserId] },
		});
		res.status(200).json({ error: false, conversation });
	} catch (error) {
		res.status(500).json({ error: true, ...error });
	}
});

module.exports = router;

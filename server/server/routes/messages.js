const router = require("express").Router();
const Message = require("../models/Message");

//new message
router.post("/", async (req, res) => {
	try {
		const message = await Message.create(req.body);
		if (message?._id) {
			res.status(201).json({ error: false, message });
		} else {
			res
				.status(404)
				.json({ error: true, message: "message cannot be created" });
		}
	} catch (error) {
		res.status(500).json({ error: true, ...error });
	}
});

//get message
router.get("/:conversationId", async (req, res) => {
	try {
		const allMessages = await Message.find({
			conversationId: req.params.conversationId,
		});

		res.status(200).json({ error: false, allMessages });
	} catch (error) {
		res.status(500).json({ error: true, ...error });
	}
});

module.exports = router;

const app = require("express")();
const server = require("http").createServer(app);
const port = process.env.PORT || 4020;
const io = require("socket.io")(server, {
	cors: { origin: "https://metabook-by-mahbub.netlify.app" },
});

let users = [];

const addUser = (userId, socketId) => {
	!users.some((user) => user?.userId === userId) &&
		users.push({ userId, socketId });
};

const removeUser = (socketId) => {
	return users.filter((user) => user?.socketId !== socketId);
};

const getUser = (userId) => {
	return users.find((user) => user?.userId === userId);
};

io.on("connect", (socket) => {
	//when Connect
	console.log("user connected");

	//take userId  and socketId from user
	socket.on("addUser", (userId) => {
		addUser(userId, socket.id);
		io.emit("getUsers", users);
	});

	//send and get message
	socket.on("sendMessage", ({ senderId, receiverId, text }) => {
		const user = getUser(receiverId);
		io.to(user?.socketId).emit("getMessage", {
			senderId,
			text,
		});
	});

	//when disconnect
	socket.on("disconnect", () => {
		users = removeUser(socket.id);
		io.emit("getUsers", users);
	});
});

app.get("/", (req, res) => {
	res.status(200).json("Hi! Mahbub. Welcome to socket Metabook");
});

// app.listen(port, () => console.log("server is listening at port 4020"));
server.listen(port, () => {
	console.log("server is running with socket at 4020");
});

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
const { isAuthentication } = require("./controller/jwt");
const port = process.env.PORT || 8080;

dotenv.config();

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true }, () => {
	console.log("Database Connected");
});

const corsOption = {
	origin: process.env.PRODUCTION_CLIENT_LINK,
	methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
};

//middleware
app.use(express.json());
app.use(helmet());
app.use(cors(corsOption));
app.use(morgan("common"));
app.use(fileUpload());

app.use("/api/auth", authRoute);
app.use("/api/users", isAuthentication, userRoute);
app.use("/api/posts", isAuthentication, postRoute);
app.use("/api/conversation", isAuthentication, conversationRoute);
app.use("/api/message", isAuthentication, messageRoute);
app.get("/", (req, res) => res.send("Hi! Mahbub. Metabook server is running."));

app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});

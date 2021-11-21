import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "../../../Context/AuthContext";
import TopBar from "../../Common/TopBar/TopBar";
import ChatBoxCenter from "../Messenger/ChatBoxCenter/ChatBoxCenter";
import ChatOnline from "../Messenger/ChatOnline/ChatOnline";
import Conversation from "../Messenger/Conversation/Conversation";
import styles from "./MessengerForMobile.module.scss";

const MessengerForMobile = () => {
	const [conversation, setConversation] = useState([]);
	const { loggedInUser } = useContext(AuthContext);
	const [currentChat, setCurrentChat] = useState({});
	const [selectConversation, setSelectConversation] = useState({});
	const [message, setMessage] = useState([]);
	const [isMyChatMobile, setIsMyChatMobile] = useState(true);
	const [isOnlineMobile, setIsOnlineMobile] = useState(false);
	const [newMessage, setNewMessage] = useState("");
	const [arrivalMessage, setArrivalMessage] = useState("");
	const socket = useRef();
	const [onlineUsers, setOnlineUsers] = useState([]);
	const scrollRef = useRef();

	useEffect(() => {
		socket.current = io("https://metabook-mahbub-server-socket.herokuapp.com");
		socket.current.on("getMessage", (data) => {
			setArrivalMessage({
				sender: data?.senderId,
				text: data?.text,
				createdAt: Date.now(),
			});
		});
	}, []);

	useEffect(() => {
		if (loggedInUser?._id) {
			socket.current.emit("addUser", loggedInUser?._id);
			socket.current.on("getUsers", (users) => {
				setOnlineUsers(
					loggedInUser.followings.filter((id) =>
						users.some((user) => user.userId === id)
					)
				);
			});
		}
	}, [loggedInUser]);

	useEffect(() => {
		arrivalMessage &&
			currentChat?.members?.includes(arrivalMessage?.sender) &&
			setMessage((prev) => [...prev, arrivalMessage]);
	}, [arrivalMessage, currentChat]);

	useEffect(() => {
		const getConversation = async () => {
			const res = await axios
				.get(
					`https://metabook-by-mahbub-server.herokuapp.com/api/conversation/${loggedInUser?._id}`,
					{
						headers: {
							"Content-Type": "application/json",
							token: `Bearer ${loggedInUser?.token}`,
						},
					}
				)
				.catch((err) => err.response && console.log(err));
			res.data?.conversation?.length &&
				setConversation(res?.data?.conversation);
		};
		loggedInUser?._id && getConversation();
	}, [loggedInUser?._id, loggedInUser?.token]);

	useEffect(() => {
		const getMessage = async () => {
			const res = await axios
				.get(
					`https://metabook-by-mahbub-server.herokuapp.com/api/message/${currentChat?._id}`,
					{
						headers: {
							"Content-Type": "application/json",
							token: `Bearer ${loggedInUser?.token}`,
						},
					}
				)
				.catch((err) => err.response && console.log(err));
			res?.data?.allMessages && setMessage(res?.data?.allMessages);
		};
		currentChat?._id && getMessage();
	}, [currentChat?._id, loggedInUser?._id, loggedInUser?.token]);

	const handleSend = async (e) => {
		e.preventDefault();
		if (newMessage?.length > 0) {
			const messageInfo = {
				sender: loggedInUser?._id,
				text: newMessage,
				conversationId: currentChat?._id,
			};
			const receiverId = currentChat?.members?.find(
				(member) => member !== loggedInUser?._id
			);
			socket.current.emit("sendMessage", {
				senderId: loggedInUser?._id,
				receiverId: receiverId,
				text: newMessage,
			});

			try {
				const res = await axios
					.post(
						`https://metabook-by-mahbub-server.herokuapp.com/api/message/`,
						messageInfo,
						{
							headers: {
								"Content-Type": "application/json",
								token: `Bearer ${loggedInUser?.token}`,
							},
						}
					)
					.catch((err) => err.response && console.log(err));
				if (res?.data?.message?._id) {
					setNewMessage("");
					setMessage([...message, res?.data?.message]);
				}
			} catch (error) {}
		}
	};

	useEffect(() => {
		scrollRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [message]);

	const handleMyChat = () => {
		setIsMyChatMobile(true);
		setIsOnlineMobile(false);
		setSelectConversation({});
	};

	const handleOnline = () => {
		setIsMyChatMobile(false);
		setIsOnlineMobile(true);
		setSelectConversation({});
	};

	const handleSelectConversation = (user) => {
		setIsMyChatMobile(false);
		setIsOnlineMobile(false);
		setSelectConversation(user);
	};

	return (
		<>
			<TopBar />
			<div className={styles.MessengerForMobile}>
				<div className={styles.messengerMenu}>
					<span onClick={handleMyChat}>My chat</span>
					<span onClick={handleOnline}>Active User</span>
				</div>
				{isMyChatMobile && !isOnlineMobile && (
					<div className={styles.chatMenuWrapper}>
						<input
							type="search"
							placeholder="Search for friends"
							className={styles.chatMenuInput}
						/>
						<div className={styles.chatMenuConversationContainer}>
							{conversation.map((item) => (
								<div key={item?._id} onClick={() => setCurrentChat(item)}>
									<Conversation
										conversation={item}
										handleSelectConversation={handleSelectConversation}
									/>
								</div>
							))}
						</div>
					</div>
				)}

				{isOnlineMobile && !isMyChatMobile && (
					<div className={styles.chatOnlineWrapper}>
						<div className={styles.chatOnlineWrapperChats}>
							<ChatOnline
								onlineUsers={onlineUsers}
								setCurrentChat={setCurrentChat}
								handleSelectConversation={handleSelectConversation}
							/>
						</div>
					</div>
				)}

				{!isMyChatMobile && !isOnlineMobile && selectConversation?._id && (
					<div className={styles.chatBoxWrapper}>
						{currentChat?._id && (
							<ChatBoxCenter
								selectConversation={selectConversation}
								handleSend={handleSend}
								message={message}
								newMessage={newMessage}
								setNewMessage={setNewMessage}
							/>
						)}
					</div>
				)}
			</div>
		</>
	);
};

export default MessengerForMobile;

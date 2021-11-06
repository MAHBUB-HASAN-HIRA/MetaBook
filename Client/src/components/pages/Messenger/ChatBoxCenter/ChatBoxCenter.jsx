import { Avatar } from "@material-ui/core";
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Message from "../Message/Message";
import styles from "./ChatBoxCenter.module.scss";

const ChatBoxCenter = ({
	selectConversation,
	message,
	handleSend,
	newMessage,
	setNewMessage,
}) => {
	const scrollRef = useRef();
	useEffect(() => {
		scrollRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [message]);
	return (
		<>
			<div className={styles.chatBoxUser}>
				<Avatar src={selectConversation?.profilePicture} />
				<div className={styles.chatBoxUserInfo}>
					<Link to={`/profile/${selectConversation?.username}`}>
						{selectConversation?.fullName}
					</Link>
					<span className={styles.chatBoxUsername}>
						{selectConversation?.username}
					</span>
				</div>
			</div>
			<div className={styles.chatBoxTop}>
				{message.map((m, index) => (
					<div ref={scrollRef} key={m?.sender + index}>
						<Message message={m} />
					</div>
				))}
			</div>
			<div className={styles.chatBoxBottom}>
				<textarea
					value={newMessage}
					onChange={(e) => setNewMessage(e.target.value)}
					className={styles.chatMessageInput}
					placeholder="Write something..."
				></textarea>
				<button onClick={handleSend} className={styles.chatSubmitButton}>
					Send
				</button>
			</div>
		</>
	);
};

export default ChatBoxCenter;

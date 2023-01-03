import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "../../../../Context/AuthContext";
import TopBar from "../../../Common/TopBar/TopBar";
import ChatBoxCenter from "../ChatBoxCenter/ChatBoxCenter";
import ChatOnline from "../ChatOnline/ChatOnline";
import Conversation from "../Conversation/Conversation";
import styles from "./Messenger.module.scss";

const Messenger = () => {
  const [conversation, setConversation] = useState([]);
  const { loggedInUser } = useContext(AuthContext);
  const [currentChat, setCurrentChat] = useState({});
  const [selectConversation, setSelectConversation] = useState({});
  const [message, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState("");
  const socket = useRef();
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    socket.current = io(
      "https://api-socket-metabook-by-mahbub-onrender.onrender.com"
    );
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
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    const getConversation = async () => {
      const res = await axios
        .get(
          `https://api-metabook-by-mahbub.onrender.com/api/conversation/${loggedInUser?._id}`,
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
          `https://api-metabook-by-mahbub.onrender.com/api/message/${currentChat?._id}`,
          {
            headers: {
              "Content-Type": "application/json",
              token: `Bearer ${loggedInUser?.token}`,
            },
          }
        )
        .catch((err) => err.response && console.log(err));
      res?.data?.allMessages && setMessages(res?.data?.allMessages);
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
            `https://api-metabook-by-mahbub.onrender.com/api/message/`,
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
          setMessages([...message, res?.data?.message]);
        }
      } catch (error) {}
    }
  };

  const handleSelectConversation = (user) => {
    setSelectConversation(user);
  };

  return (
    <>
      <TopBar />
      <div className={styles.messenger}>
        <div className={styles.chatMenu}>
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
        </div>
        <div className={styles.chatBox}>
          <div className={styles.chatBoxWrapper}>
            {currentChat?._id ? (
              <ChatBoxCenter
                selectConversation={selectConversation}
                handleSend={handleSend}
                message={message}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
              />
            ) : (
              <span className={styles.noConversationText}>
                Open a conversation to start a chats.
              </span>
            )}
          </div>
        </div>
        <div className={styles.chatOnline}>
          <div className={styles.chatOnlineWrapper}>
            <div className={styles.chatOnlineWrapperChats}>
              <ChatOnline
                onlineUsers={onlineUsers}
                setCurrentChat={setCurrentChat}
                handleSelectConversation={handleSelectConversation}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Messenger;

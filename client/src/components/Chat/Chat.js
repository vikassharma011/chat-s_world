import React, { useEffect, useState } from "react";
import { user } from "../Join/Join";
import socketIo from "socket.io-client";
import "./Chat.css";
import sendLogo from "../../images/send.png";
import Message from "../Message/Message";
import ReactScrollToBottom from "react-scroll-to-bottom";
import closeIcon from "../../images/closeIcon.png";

let socket;
const ENDPOINT = "http://localhost:5002";

const Chat = () => {
    const [id, setId] = useState("");
    const [messages, setMessages] = useState([]);

    const send = () => {
        const message = document.getElementById('chatInput').value;
        if (message) {
            socket.emit('message', { message, id });
            document.getElementById('chatInput').value = "";
        }
    };

    useEffect(() => {
        // Initialize socket connection
        socket = socketIo(ENDPOINT, { transports: ['websocket'] });

        // On socket connect
        socket.on('connect', () => {
            setId(socket.id);
        });

        // Emit the 'joined' event when connected
        socket.emit('joined', { user });

        // Listen for 'welcome' event from server
        socket.on('welcome', (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        // Listen for 'userJoined' event
        socket.on('userJoined', (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        // Listen for 'leave' event when a user leaves
        socket.on('leave', (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        // Cleanup on component unmount
        return () => {
            socket.off(); // Remove event listeners
        };
    }, []);

    useEffect(() => {
        // Listen for 'sendMessage' event from server
        socket.on('sendMessage', (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        // Cleanup event listener on component unmount
        return () => {
            socket.off('sendMessage'); // Remove specific event listener
        };
    }, []);

    return (
        <div className="chatPage">
            <div className="chatContainer">
                <div className="header">
                    <h2>Hi CHATTY</h2>
                    <a href="/"> <img src={closeIcon} alt="Close" /></a>
                </div>

                <ReactScrollToBottom className="chatBox">
                    {messages.map((item, i) => (
                        <Message
                            key={i}
                            user={item.id === id ? '' : item.user}
                            message={item.message}
                            classs={item.id === id ? 'right' : 'left'}
                        />
                    ))}
                </ReactScrollToBottom>

                <div className="inputBox">
                    <input
                        onKeyPress={(event) => event.key === 'Enter' ? send() : null}
                        type="text"
                        id="chatInput"
                        placeholder="Enter Your Message"
                    />
                    <button onClick={send} className="sendBtn">
                        <img src={sendLogo} alt="Send" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;

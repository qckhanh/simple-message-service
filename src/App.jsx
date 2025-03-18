// src/App.jsx
import io from 'socket.io-client';
import {useEffect, useRef, useState} from "react";
import {faCircleDot, faPaperPlane} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import PopUp from "@/PopUp.jsx";
import {BlurFade} from "@/components/magicui/blur-fade.js";
import BlurText from "@/components/reactbits/blur-text.jsx";
import { Howl } from 'howler';

// const socket = io('http://localhost:3000',{
const socket = io('https://simple-message-service-1.onrender.com', {
    autoConnect: false, // Prevent auto-reconnect
    transports: ["websocket"], // Use WebSocket only
});

const notificationSound = new Howl({
    src: ['/noti.mp3'],
    volume: 1.0, // Ensure full volume
    html5: true, // Use HTML5 Audio API (better for background tabs)
});


function App() {
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [currentOnlineUser, setCurrentOnlineUser] = useState(0);
    const chatContainerRef = useRef(null);
    const [isSender, setIsSender] = useState(false); // Track if current user sent a message

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };


    useEffect(message => {
        // Ensure socket only connects once
        if (!socket.connected) {
            socket.connect();
        }

        socket.on('assign username', (assignedUsername) => {
            setUsername(assignedUsername);
        });



        const handleMessage = (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
            playNotificationSound();
        };

        const handleUserCount = (count) => {
            setCurrentOnlineUser(count);
        }

        const playNotificationSound = () => {
            notificationSound.play();
        };

        socket.on('chat message', handleMessage);
        socket.on('user count', handleUserCount);

        return () => {
            socket.off('chat message', handleMessage);
            socket.off('assign username');
            socket.off("user count", handleUserCount);
            socket.disconnect(); // Properly disconnect the socket
        };
    }, []);

    useEffect(() => {
        if(isSender){
            scrollToBottom();
            setIsSender(false);
        }
    }, [messages]);


    const sendMessage = () => {
        if(!socket.connected) socket.connect();

        if (message.trim()) {
            socket.emit('chat message', { username, message });
            setMessage('');
            setIsSender(true);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Display Online Users */}
            <div className={`${socket.connected ? "bg-green-700 " : " bg-red-700"} font-bold p-4 bg-green-600 text-white text-center flex flex-row gap-4 justify-center`}>
                <div>
                    <FontAwesomeIcon size={"xl"} icon={faCircleDot} beatFade className={`rounded-full ${socket.connected ? "bg-green-700 " : " bg-red-700"}`} />
                </div>
                {/*Online:<b>{currentOnlineUser}</b>*/}
                {socket.connected ? 'Online:  ' + currentOnlineUser : "Server is offline"}
            </div>

            {/*<PopUp/>*/}

            {/* Messages Container */}
            <div ref={chatContainerRef} className="flex-1 overflow-auto p-4 space-y-2">
                {messages.map((msg, index) => {
                    const isSelf = msg.username === username;
                    const isContinuous = index > 0 && messages[index - 1].username === msg.username;

                    return (
                        <div key={index} className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}>
                            <div>
                                {!isContinuous && (
                                <div className={`text-gray-600 text-sx ${isSelf ? 'text-right pr-2' : 'text-left pl-2'}`}>
                                    {isSelf ? "Me" : msg.username}
                                </div>)}
                                {/*max-w-xs mb-2 py-2 px-3 bg-gray-200 rounded-xl rounded-bl-none*/}
                                {/*p-3 rounded-full max-w-fit ${isSelf ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}*/}
                                <div className={`inline-block max-w-md mb-2 py-2 px-3 rounded-2xl ${isSelf ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-300 text-black rounded-bl-none'}`}>
                                    <BlurFade delay={0.2} inView={false}>
                                        <div className={"font-semibold"}>
                                            {msg.message}
                                        </div>
                                    </BlurFade >
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/*<PopUp/>*/}

            {/* Input Field */}
            <div className={"text-center text-gray-400 font italic p-2 text-sm lg:text-xl md:text-lg sm:text-md"}>
                This product is built by <a href={"https://www.facebook.com/qckhanh2005/"} className={"text-blue-500"}>Quốc Khánh</a>. Any feedback/bug is welcome!
            </div>
            <div className="text-center text-gray-400 italic p-2 text-sm lg:text-xl md:text-lg sm:text-md">
                All messages will be disappeared when you refresh the page.
            </div>
            <div className="p-4 bg-white flex border-t">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1 p-2 border-1 border-gray-400 rounded-full p-2 font-semibold"
                    placeholder="Type your message... No community guidelines here!"
                />
                <button
                    onClick={sendMessage}
                    className="ml-4 p-4 bg-blue-500 text-white rounded-full font-semibold"
                >
                    <FontAwesomeIcon size={"xl"} icon={faPaperPlane} />
                </button>
            </div>
        </div>
    );
}

export default App;

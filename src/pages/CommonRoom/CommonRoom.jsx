import {useEffect, useRef, useState} from "react";
import io from "socket.io-client";
import {Howl} from "howler";
import Inputbox from "@/components/Inputbox/Inputbox.jsx";
import MessageContainer from "@/components/MessageContainer/MessageContainer.jsx";
import StatusBar from "@/StatusBar/StatusBar.jsx";

const socket = io('https://simple-message-service.onrender.com', {
    autoConnect: true, // Prevent auto-reconnect
    transports: ["websocket"], // Use WebSocket only
});

const notificationSound = new Howl({
    src: ['/noti.mp3'],
    volume: 1.0, // Ensure full volume
    html5: true, // Use HTML5 Audio API (better for background tabs)
});

const MB = 1024 * 1024;

const CommonRoom = () => {
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [currentOnlineUser, setCurrentOnlineUser] = useState(0);
    const chatContainerRef = useRef(null);
    const [isSender, setIsSender] = useState(false); // Track if current user sent a message

    useEffect( () => {
        // Ensure socket only connects once
        if (!socket.connected) {
            socket.connect();
        }

        //listen from server ( backend)
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
        if(!socket.connected){
            socket.connect();
            return;
        }

        if (message.trim()) {
            socket.emit('chat message', { username, message, type: "text" });
            setMessage('');
            setIsSender(true);
        }
    };

    const sendImage = (event) => {
        const selectedImage = event.target.files[0];
        if(!selectedImage || selectedImage.size > 8 * MB ){
            alert("Please select an image less than 8MB");
            return;
        }

        const reader = new FileReader();

        reader.readAsDataURL(selectedImage);
        reader.onload = () => {
            const image = reader.result;
            socket.emit('chat message', { username, message: image, type: "image"});
            setIsSender(true);
        };
    };

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <StatusBar
                socket={socket}
                currentOnlineUser={currentOnlineUser}
            />
            <MessageContainer
                chatContainerRef={chatContainerRef}
                messages={messages}
                isSender={isSender}
                username={username}
            />
            <Inputbox
                sendMessage={sendMessage}
                message={message}
                setMessage={setMessage}
                sendImage={sendImage}
            />
        </div>
    );
}

export default CommonRoom;
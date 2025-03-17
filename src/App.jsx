// src/App.jsx
import io from 'socket.io-client';
import {useEffect, useState} from "react";

// const socket = io('http://localhost:3000');
const socket = io('https://simple-message-service-1.onrender.com');


function App() {
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.on('assign username', (assignedUsername) => {
            setUsername(assignedUsername);
        });

        const handleMessage = (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        };

        socket.on('chat message', handleMessage);

        return () => {
            socket.off('chat message', handleMessage);
            socket.off('assign username');
        };
    }, []);

    const sendMessage = () => {
        if (message.trim()) {
            socket.emit('chat message', { username, message });
            setMessage('');
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Messages Container */}
            <div className="flex-1 overflow-auto p-4 space-y-2">
                {messages.map((msg, index) => {
                    const isSelf = msg.username === username;

                    return (
                        <div key={index} className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-3 rounded-lg max-w-xs ${isSelf ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
                                <strong>[{isSelf ? "me" : msg.username}]:</strong> {msg.message}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Input Field */}
            <div className="p-4 bg-white flex border-t">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1 p-2 border rounded-lg"
                    placeholder="Type your message..."
                />
                <button
                    onClick={sendMessage}
                    className="ml-2 p-2 bg-blue-500 text-white rounded-lg"
                >
                    Send
                </button>
            </div>
        </div>
    );
}


// function App() {
//     const [username, setUsername] = useState('');
//     const [message, setMessage] = useState('');
//     const [messages, setMessages] = useState([]);
//
//     useEffect(() => {
//         socket.on('assign username', (assignedUsername) => {
//             setUsername(assignedUsername);
//         });
//
//         const handleMessage = (msg) => {
//             setMessages((prevMessages) => [...prevMessages, msg]);
//         };
//
//         socket.on('chat message', handleMessage);
//
//         return () => {
//             socket.off('chat message', handleMessage);
//             socket.off('assign username');
//         };
//     }, []);
//
//     const sendMessage = () => {
//         if (message.trim()) {
//             socket.emit('chat message', { username, message });
//             setMessage(''); // Clear input, but don't update messages state directly
//         }
//     };
//
//     return (
//         <div className="flex flex-col h-screen">
//             <div className="flex-1 overflow-auto p-4">
//                 {messages.map((msg, index) => (
//                     <div key={index} className="mb-2">
//                         <strong>[{msg.username}]:</strong> {msg.message}
//                     </div>
//                 ))}
//             </div>
//             <div className="p-4 bg-gray-200 flex">
//                 <input
//                     type="text"
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
//                     className="flex-1 p-2 border rounded"
//                     placeholder="Type your message..."
//                 />
//                 <button
//                     onClick={sendMessage}
//                     className="ml-2 p-2 bg-blue-500 text-white rounded"
//                 >
//                     Send
//                 </button>
//             </div>
//         </div>
//     );
// }

export default App;

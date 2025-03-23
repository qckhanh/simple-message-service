// server/index.js
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { Buffer } from 'buffer';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
    maxHttpBufferSize: 50e6 // Increase Socket.IO buffer size to 50MB
});

app.use(cors());
// app.use(express.static('uploads')); // Serve uploaded images
app.use(express.json({ limit: '50mb' })); // Increased limit for larger images

let totalOnlineUser = 0;
let userCount = 1;

function handleImage(data) {
    console.log(`Received image from ${data.username}`);

    // Emit the Base64 image directly to all clients
    io.emit('chat message', {
        username: data.username,
        message: data.message, // Send Base64 string
        type: 'image'
    });
}

io.on('connection', (socket) => {
    totalOnlineUser++;

    const username = `Anonymous user ${userCount++}`;

    //send message to client ( front end)
    socket.emit('assign username', username);

    console.log(`A user connected. Online users: ${totalOnlineUser}`);
    io.emit('user count', totalOnlineUser); // update to all users that someone connected

    //receive message from client ( front end)
    socket.on('chat message', (data) => {
        if(data.type === "text") io.emit('chat message', { username: data.username, message: data.message, type: data.type });
        else handleImage(data);
    });

    socket.on('disconnect', () => {
        console.log(`A user disconnected. Online users: ${totalOnlineUser}`);
        if(totalOnlineUser > 0) {
            totalOnlineUser--;
        }
        io.emit('user count', totalOnlineUser); // update to all users that someone disconnected
    });
});

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
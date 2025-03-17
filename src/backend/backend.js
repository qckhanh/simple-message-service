// server/index.js
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    }
});

app.use(cors());
let totalOnlineUser = 0;
let userCount = 1;

io.on('connection', (socket) => {
    totalOnlineUser++;

    const username = `Anonymous user ${userCount++}`;
    socket.emit('assign username', username);

    console.log(`A user connected. Online users: ${totalOnlineUser}`);
    io.emit('user count', totalOnlineUser); // Broadcast updated count to all users


    socket.on('chat message', (data) => {
        io.emit('chat message', { username: data.username, message: data.message });
    });

    socket.on('disconnect', () => {
        console.log(`A user disconnected. Online users: ${totalOnlineUser}`);
        if(totalOnlineUser > 0) {
            totalOnlineUser--;
        }
        io.emit('user count', totalOnlineUser); // Broadcast updated count to all users

    });
});

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


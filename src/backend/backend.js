// server/index.js
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: 'http://localhost:5173',
//         methods: ['GET', 'POST'],
//     },
// });
//
// app.use(cors());
//
// let userCount = 0;
//
// io.on('connection', (socket) => {
//     userCount += 1;
//     const username = `anonymous user ${userCount}`;
//     socket.emit('assign username', username);
//     console.log(`${username} connected`);
//
//     socket.on('chat message', (msg) => {
//         io.emit('chat message', msg);
//     });
//
//     socket.on('disconnect', () => {
//         console.log(`${username} disconnected`);
//     });
// });
//
// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

app.use(cors());

let userCount = 1; // Track anonymous users

io.on('connection', (socket) => {
    const username = `anonymous user ${userCount++}`;
    socket.emit('assign username', username);

    console.log(`${username} connected`);

    socket.on('chat message', (data) => {
        io.emit('chat message', { username: data.username, message: data.message });
    });

    socket.on('disconnect', () => {
        console.log(`${username} disconnected`);
    });
});

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


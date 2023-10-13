const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');  

const app = express();

// Criando o server
const server = http.createServer(app);

const io = socketIO(server);

// Definindo a porta do server
server.listen(3000);

let connectedUsers = [];

// localizando a pasta dos arquivos
app.use(express.static(path.join(__dirname, 'public')));

// listener
io.on('connection', (socket) => {
    console.log('conexão detectada...');

    socket.on('join-request', (username) => {
        socket.username = username;

        connectedUsers.push(username);

        console.log(connectedUsers)

        socket.emit('user-ok', connectedUsers);

        // todos os usuários menos o que entrou
        socket.broadcast.emit('list-update', {
            joined: username,
            list: connectedUsers
        });
    });

    // Quando alguém desconectar
    socket.on('disconnect', () => {
        connectedUsers = connectedUsers.filter(u => u != socket.username);

        console.log(connectedUsers)

        socket.broadcast.emit('list-update', {
            left: socket.username,
            list: connectedUsers
        });
    })

    socket.on('send-message', (txt) => {
        let obj = {
            username: socket.username,
            message: txt
        };

        // socket.emit('showMsg', obj);
        socket.broadcast.emit('showMsg', obj);
    })

});
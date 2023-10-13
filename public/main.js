// iniciando a conexão
const socket = io();

let userName = '';
let userList = [];

let loginPage = document.querySelector('#loginPage');
let chatPage = document.querySelector('#chatPage');

let loginInput = document.querySelector('#loginNameInput');
let textInput = document.querySelector('#chatTextInput');

loginPage.style.display = 'flex';
chatPage.style.display = 'none';

loginInput.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        let name = loginInput.value.trim()

        if (name != '') {
            username = name;
            document.title = `Chat (${username})`

            socket.emit('join-request', username)
        }
    }

})

function renderUserList() {
    let ul = document.querySelector('.userList');

    ul.innerHTML = '';

    userList.forEach(element => {
        ul.innerHTML += `<ul>${element}</ul>`
    });
}

function addMessage(type, user, message) {
    let ul = document.querySelector('.chatList');

    switch (type) {
        case 'status':
            ul.innerHTML += `<li class="m-status">${message}</li>`;
            break;
        case 'msg':
            ul.innerHTML += `<li class="m-txt"><span>${user}</span> ${message}</li>`;
            break;

    }
}

// listener de client
socket.on('user-ok', (list) => {
    loginPage.style.display = 'none';
    chatPage.style.display = 'flex';

    textInput.focus();

    addMessage('status', null, 'Conectado!');

    userList = list;

    renderUserList();
})

socket.on('list-update', (data) => {
    if (data.joined) {
        addMessage('status', null, `${data.joined} entrou no chat.`);
    }

    if (data.left) {
        addMessage('status', null, `${data.left} saiu do chat.`);
    }

    userList = data.list;

    renderUserList();
})

textInput.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        let text = textInput.value.trim();
        textInput.value = '';

        if (text != '') {
            addMessage('msg', username, text)
            socket.emit('send-message', text);
        }
    }
})

socket.on('showMsg', (data) => {

    console.log(data);
    addMessage('msg', data.username, data.message)
})
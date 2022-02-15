const socket = io('http://localhost:8000');
const form = document.getElementById('send-container')
const messageInput = document.getElementById('messageInp')
const messageContainer = document.querySelector(".container")


var audio = new Audio('ting.mp3')
let value = false;
let first = "";
const append = (message, position) => {
    const messsageElement = document.createElement('div')
    messsageElement.innerText = message;
    messsageElement.classList.add('message');
    messsageElement.classList.add(position);
    messageContainer.append(messsageElement);
    value = (messageInput.value).startsWith("@");
    console.log(value);
    if (value == true) {
        first = (messageInput.value).substring(1, (messageInput.value).indexOf(' '));
    }
    console.log(first);
    if (position == 'left') {
        audio.play();
    }

}
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`you:${message}`, 'right');
    if (value == false) {
        socket.emit('send', message);
    }
    else if (value == true) {
        socket.emit('personal-message', message);
    }
    messageInput.value = '';
})


// let c=0;
var username;

do {
    username = prompt("Enter your name :");
} while (!username)
socket.emit('new-user-joined', username);


socket.on('user-joined', username => {
    append(`${username} joined the chat`, 'right')
})

socket.on('receive', data => {
    append(`${data.username}: ${data.message}`, 'left')
})
socket.on('personal', data => {
    data.message=data.message.substring((data.message).indexOf(' '));
    append(`${data.username}: ${data.message}`, 'left')
})

socket.on('left', username => {
    append(`${username} left the chat`, 'right')
})
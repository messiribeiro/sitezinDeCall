const messageContainer = document.querySelector('#messages')




document.addEventListener('DOMContentLoaded', (event) => {
    const video = document.querySelector('.vidPlayer');
    const video2 = document.querySelector('.vidPlayer2');

    video.controls = false;
    video2.controls = false;

    navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
        video.onloadedmetadata = (e) => {
            video.play();
        };
    })
    .catch( () => {
        
    });

    navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video2.srcObject = stream;
        video2.onloadedmetadata = (e) => {
            video2.play();
        };
    })
    .catch( () => {
        
    });
});

const socket = io('http://localhost:3333');


try {
    socket.on('getSessionId', (data) => {
        //Armazenando o id da sessão no localStorage
        localStorage.setItem('sessionId', data.sessionId)
    
        //Enviando o id da sessão para o backend via socket.io
        socket.emit('initSession', data.sessionId)
        
        //recebendo o id do receiver
        socket.on('receiverId', (data) =>{
            localStorage.setItem('receiverId', data.receiverId)
        })

        socket.on('receiverDisconnected', (data) => {
            // alert('carinha desconectou')
            // localStorage.removeItem('receiverId');
            // location.reload()
        })

    })

    //Evento para receber mensagens a partir do socket.io

    socket.on('newMessage', (data) => {
        const {message} = data;

        renderMessage(message, 'receiver');

    })

    socket.on('receiverDisconnected', () =>{
        console.log('o carinha saiu')
    })
    
    socket.on('newConnection', (data) => {
        localStorage.setItem("receiverId", data.id)
    })

    
}catch(e) {
    console.log(e)
}



const form = document.querySelector('#text-input');
const messageText = document.querySelector('.message-text');

var divIdControll = 0

form.addEventListener('submit', (e) => {
    e.preventDefault()
    if(messageText.value !== '') {
        socket.emit('sendMessage', {
            receiverId: localStorage.getItem('receiverId'),
            message: messageText.value
        })

        renderMessage(messageText.value, 'sender')
        messageText.value = ''
        
    }
    
})


const renderMessage = (messageText, side) => {


    var div = document.createElement('div');
    var message = document.createElement('p');
    var time = document.createElement('p');
    time.className = 'time';
    message.className = 'message'
    div.id = divIdControll
    if(side == 'sender') {
        div.className = 'sender'
    }else {
        div.className = 'target'
    }

    console.log(messageContainer)

    messageContainer.appendChild(div);
    message.textContent = messageText

    const date = new Date();
    
    time.textContent = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
    div.appendChild(message)
    div.appendChild(time)
    messageText.value = ''
    messageContainer.scrollTo(0, messageContainer.scrollHeight)
    divIdControll++

    // if (messageContainer.scrollHeight > messageContainer.clientHeight) {
    //     messageContainer.id = 'messages-scroll'
    // }
}



// const chatContainer = document.querySelector('#chat-container');
// const inputContainer = document.querySelector('#text-input');


// console.log(chatContainer.offsetHeight)
// console.log(inputContainer.offsetHeight)
// messageContainer.style.height = `${chatContainer.offsetHeight}px`
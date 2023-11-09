document.addEventListener('DOMContentLoaded', (event) => {
    const video = document.querySelector('#vidPlayer');
    navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
        video.onloadedmetadata = (e) => {
            video.play();
        };
    })
    .catch( () => {
        alert('You have to give the browser permission to run the webcam and microphone ;( ');
    });
});
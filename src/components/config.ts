const firebaseConfig = {
    apiKey: "AIzaSyC30tFghLi33sHfOR5TmyKhUs5OpXf2a-0",
    authDomain: "chess-clock-74319.firebaseapp.com",
    projectId: "chess-clock-74319",
    storageBucket: "chess-clock-74319.appspot.com",
    messagingSenderId: "699302589921",
    appId: "1:699302589921:web:107b8c0349bcc3d7124ea0"
};


const servers = {
    iceServers: [
        {
            urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
        },
    ],
    iceCandidatePoolSize: 10,
};

export {
    firebaseConfig,
    servers
}
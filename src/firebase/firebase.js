import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {getStorage} from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDvekohJDAeehi3DcNC3uEugSDpDRHzjO8",
    authDomain: "chat-e267f.firebaseapp.com",
    projectId: "chat-e267f",
    storageBucket: "chat-e267f.appspot.com",
    messagingSenderId: "569342359684",
    appId: "1:569342359684:web:2413df650cf7f6e751aad1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export const storage = getStorage(app);
// src/firebase.js
import {
    initializeApp
} from "firebase/app";
import {
    getAuth
} from "firebase/auth";
import {
    getFirestore
} from "firebase/firestore";
import {
    getStorage
} from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyABluTvgm8LZ92u-4I9c-Hds2-DsR2NjGM",
    authDomain: "tushar-swami.firebaseapp.com",
    projectId: "tushar-swami",
    storageBucket: "tushar-swami.firebasestorage.app",
    messagingSenderId: "86719876060",
    appId: "1:86719876060:web:012ba46678aaf4d72fdd19"
};
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export services
export { auth, db, storage };
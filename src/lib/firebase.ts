import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyBEI_hm0m30VVj88S-it6ITCkfIsxZ80eQ",
    authDomain: "pubmed-dashboard.firebaseapp.com",
    projectId: "pubmed-dashboard",
    storageBucket: "pubmed-dashboard.firebasestorage.app",
    messagingSenderId: "591399208334",
    appId: "1:591399208334:web:77e581cd15e3ce7550d0df",
    measurementId: "G-4XNMCFH8T7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

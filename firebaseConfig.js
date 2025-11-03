// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB_KtC4NJ-26sSmsHqHHhL1YCKxcQJaMh8",
  authDomain: "mawimonapp.firebaseapp.com",
  projectId: "mawimonapp",
  storageBucket: "mawimonapp.firebasestorage.app",
  messagingSenderId: "46716512501",
  appId: "1:46716512501:web:45e663c930f38000b93dbc"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);


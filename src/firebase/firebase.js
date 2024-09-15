// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "travaye-dev.firebaseapp.com",
  projectId: "travaye-dev",
  storageBucket: "travaye-dev.appspot.com",
  messagingSenderId: "675047268961",
  appId: "1:675047268961:web:d29b9de37d5488fa658020",
  measurementId: "G-WZQ37JMJHY"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
export const messaging = async () => await isSupported() && getMessaging(firebaseApp);

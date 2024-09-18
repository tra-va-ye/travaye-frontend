import { initializeApp } from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "travaye-production.firebaseapp.com",
  projectId: "travaye-production",
  storageBucket: "travaye-production.appspot.com",
  messagingSenderId: "477282518114",
  appId: "1:477282518114:web:93a0f76b8575dc46597d3b",
  measurementId: "G-BB45CKRSBL"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
export const messaging = async () => await isSupported() && getMessaging(firebaseApp);

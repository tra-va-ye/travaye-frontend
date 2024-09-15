import { getToken, onMessage } from "firebase/messaging";
import { db, messaging } from "./firebase";
import { doc, setDoc } from "firebase/firestore";
import { notification } from "antd";

const FCM_TOKEN_COLLECTION = "fcmTokens";

async function requestPermission(userId) {
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
        console.log('Notification permission granted.');
        await saveDeviceMessagingToken(userId);
    } else {
        notification.error({
            message: "Notification permission failed",
            duration: 3,
            placement: "bottomRight",
        });
    }
}

export async function saveDeviceMessagingToken (userId) {
    const msg = await messaging();
    const fcmToken = await getToken(msg, { vapidKey: process.env.REACT_APP_VAPID_KEY });
    
    if (fcmToken) {
        console.log("Token found", fcmToken);
        const tokenRef = doc(db, FCM_TOKEN_COLLECTION, userId);

        await setDoc(tokenRef, { fcmToken });

        onMessage(msg, (message) => {
            console.log("New foreground notification from FCM", message);
            
            new Notification(message.notification.title, { body: message.notification.body });
        })
    } else {
        requestPermission(userId);
    }
}

navigator.serviceWorker.register('/firebase-messaging-sw.js', { type: 'module' });
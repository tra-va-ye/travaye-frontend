import { getToken, onMessage } from "firebase/messaging";
import { db, messaging } from "./firebase";
import { doc, setDoc } from "firebase/firestore";
import { notification } from "antd";

const FCM_TOKEN_COLLECTION = "fcmTokens";

async function requestPermission(userId) {
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            console.log("Permission granted");
            
            if ("serviceWorker" in navigator) {
                try {
                    // Register the Service Worker
                    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
                    console.log(registration);

                    // Wait for the Service Worker to be ready
                    await navigator.serviceWorker.ready;

                    console.log('Notification permission granted.');
                    await saveDeviceMessagingToken(userId);

                    // Replace the above with your own logic

                } catch (error) {
                    console.error("Error setting up Service Worker or getting token:", error);
                }
            } else {
                console.error("No service worker");
                
            }
        } else {
            notification.error({
                message: "Notification permission failed",
                duration: 3,
                placement: "bottomRight",
            });
        }
    } catch (error) {
        console.error("An error occurred while requesting permission:", error);
    }
}

export async function saveDeviceMessagingToken (userId) {
    const msg = await messaging();
    const fcmToken = await getToken(msg, { vapidKey: process.env.REACT_APP_VAPID_KEY });
    
    if (fcmToken) {
        // console.log("Token found", fcmToken);
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
/* eslint-disable no-undef */
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyA3Yt285UY9vSAwgM5ldHQeqgDahAZ-aUc",
  authDomain: "travaye-production.firebaseapp.com",
  projectId: "travaye-production",
  storageBucket: "travaye-production.appspot.com",
  messagingSenderId: "477282518114",
  appId: "1:477282518114:web:93a0f76b8575dc46597d3b",
  measurementId: "G-BB45CKRSBL"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

// eslint-disable-next-line no-restricted-globals
self.addEventListener("install", (event) => {
  console.log("Service worker installed");
});
  
// eslint-disable-next-line no-restricted-globals
self.addEventListener("activate", (event) => {
  console.log("Service worker activated");
});

messaging.onBackgroundMessage(payload => {
  // console.log('Received background message', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  // eslint-disable-next-line no-restricted-globals
  self.registration.showNotification(notificationTitle, notificationOptions);
});

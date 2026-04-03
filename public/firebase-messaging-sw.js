// Firebase Messaging Service Worker
// This file MUST be in the public/ folder
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyD-E55rcOZoj8xGUt8gIVE2jHeCNYSoJEw",
  authDomain: "tellimeds.firebaseapp.com",
  projectId: "tellimeds",
  storageBucket: "tellimeds.firebasestorage.app",
  messagingSenderId: "408007613568",
  appId: "1:408007613568:web:e7ca9f5a2d4df32f3fda65",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || "TelliMeds Reminder";
  const options = {
    body: payload.notification?.body || "Time to take your medicine!",
    icon: "/icon-192.png",
    badge: "/icon-72.png",
    vibrate: [200, 100, 200],
    actions: [
      { action: "taken", title: "✅ Taken" },
      { action: "skip", title: "⏭️ Skip" },
    ],
  };
  self.registration.showNotification(title, options);
});

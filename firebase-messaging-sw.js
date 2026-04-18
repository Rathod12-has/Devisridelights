// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/12.10.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.10.0/firebase-messaging-compat.js');

// 1. Initialize Firebase in the background
const firebaseConfig = {
    apiKey: "AIzaSyC7uuy0yYV3L17RJ0RvbN-mrfqrT4PquMo",
    authDomain: "devi-sri-delights.firebaseapp.com",
    projectId: "devi-sri-delights",
    storageBucket: "devi-sri-delights.firebasestorage.app",
    messagingSenderId: "73108349440",
    appId: "1:73108349440:web:8ca038c61c9a85b2b12ee5",
    measurementId: "G-FSKW9M3WL1"
};
firebase.initializeApp(firebaseConfig);

// 2. Set up the background messenger
const messaging = firebase.messaging();

// 3. Catch the push notification when the app is minimized/sleeping
messaging.onBackgroundMessage(function(payload) {
    console.log('Received background push: ', payload);
    const notificationTitle = payload?.notification?.title || "🎉 Order Ready!";
    const notificationOptions = {
        body: payload?.notification?.body || "Your food is ready for pickup!",
        icon: "https://cdn-icons-png.flaticon.com/512/3170/3170733.png",
        vibrate: [200, 100, 200, 100, 200],
        requireInteraction: true
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// 4. If they tap the notification banner, open the app
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(clients.openWindow('/'));
});

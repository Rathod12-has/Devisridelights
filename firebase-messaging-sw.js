// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/12.10.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.10.0/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyC7uuy0yYV3L17RJ0RvbN-mrfqrT4PquMo",
    authDomain: "devi-sri-delights.firebaseapp.com",
    projectId: "devi-sri-delights",
    storageBucket: "devi-sri-delights.firebasestorage.app",
    messagingSenderId: "73108349440",
    appId: "1:73108349440:web:8ca038c61c9a85b2b12ee5"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png', // Add a path to your shop's logo here if you have one
    badge: '/icon.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
    

importScripts('https://www.gstatic.com/firebasejs/10.6.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.6.0/firebase-messaging-compat.js');



// Initialize the Firebase app in the service worker by passing the generated config.


firebase.initializeApp({
  apiKey: "AIzaSyB0nABXIV_kAKMpHStnzg_RAQ30nULnQXk",
  authDomain: "true-meniu.firebaseapp.com",
  projectId: "true-meniu",
  storageBucket: "true-meniu.appspot.com",
  messagingSenderId: "797347778793",
  appId: "1:797347778793:web:80a7be921c939dff71a078",
  measurementId: "G-PVD9BMRH14"
});




// Retrieve an instance of Firebase Messaging so that it can handle background messages.
 firebase.messaging().onBackgroundMessage(function(payload) {
  console.log('sw')
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
      body: payload.notification.body,
      icon: payload.notification.icon || '/default-icon.png',
      // Other options like actions, click_action, etc.
  };

  self.registration.showNotification(notificationTitle, notificationOptions);

});

// firebase-init.js
// REPLACE the values below with your Firebase project's config
// Get them from Firebase Console → Project Settings → SDK setup (Web)
const firebaseConfig = {
  apiKey: "AIzaSyAAX3D9Uvdf3-wjStF7Q0HlOPJlpSh5AcY",
  authDomain: "nagar-mitr.firebaseapp.com",
  projectId: "nagar-mitr",
  storageBucket: "nagar-mitr.appspot.com",
  messagingSenderId: "61574803952",
  appId: "1:61574803952:web:60fef6039309bd4c9c6d35"
};

// Use the compat SDK initialization (works with plain <script> includes)
firebase.initializeApp(firebaseConfig);

// Expose services for simple access from other scripts
window._FM = {
  auth: firebase.auth(),
  storage: firebase.storage(),
  firestore: firebase.firestore()
};

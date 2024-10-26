// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Add this import

const firebaseConfig = {
  apiKey: "AIzaSyCcA9Xw2jSEDlBw-HnVdegz1xmQ_acdE4I",
  authDomain: "project-5a02a.firebaseapp.com",
  projectId: "project-5a02a",
  storageBucket: "project-5a02a.appspot.com",
  messagingSenderId: "323651390461",
  appId: "1:323651390461:web:84ecf0eec74c24eb896794",
  measurementId: "G-0BCVGR2F5F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const db = getFirestore(app); // Initialize Firestore

export { app, auth, analytics, db }; // Add db to exports
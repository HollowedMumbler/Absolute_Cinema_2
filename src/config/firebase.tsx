// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5nwiDPQEAOdRhMaPk1pVTbPZfwaT4G7M",
  authDomain: "eco-racer-326a9.firebaseapp.com",
  projectId: "eco-racer-326a9",
  storageBucket: "eco-racer-326a9.firebasestorage.app",
  messagingSenderId: "159065584702",
  appId: "1:159065584702:web:2fc16d77cf65012b494d6f",
  measurementId: "G-XYYWQJ1Y72"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, analytics, db };
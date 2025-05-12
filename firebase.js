// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAE2G29-wUIxCCc-9YPDr-z33YW6CX1PLQ",
  authDomain: "skillswap-4980a.firebaseapp.com",
  projectId: "skillswap-4980a",
  storageBucket: "skillswap-4980a.firebasestorage.app",
  messagingSenderId: "320057904908",
  appId: "1:320057904908:web:56cd0b9004a66bf295c329",
  measurementId: "G-LJQ6JVRD7N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
if (auth.currentUser) {
  console.log("Logged in as:", auth.currentUser.email);
} else {
  console.log("No user is logged in.");
}
const db = getDatabase(app);

// Export them for use in your app
export { app, auth, db };
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCVYh-d-V7sxYWKcYxB_ep62HQTJHITasg",
  authDomain: "pantry-b2a5f.firebaseapp.com",
  projectId: "pantry-b2a5f",
  storageBucket: "pantry-b2a5f.appspot.com",
  messagingSenderId: "349222870664",
  appId: "1:349222870664:web:f53aa72dba3b117eab493d",
  measurementId: "G-R3JCGBRCXT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

export {app, auth, db};
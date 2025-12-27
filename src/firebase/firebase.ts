// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDgYHRK0rCyc__erJDonGnQ66JJK4tpyb0",
  authDomain: "paltan-pryg.firebaseapp.com",
  projectId: "paltan-pryg",
  storageBucket: "paltan-pryg.firebasestorage.app",
  messagingSenderId: "796346855900",
  appId: "1:796346855900:web:0f3a81d154b4cae3749f19",
  measurementId: "G-1QDJJYLD4J"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
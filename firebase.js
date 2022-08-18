// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from 'firebase/firestore' 
import { getAuth } from 'firebase/auth'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBcgo0Y4tcWzyR2qcpJcfZHHBUQTVM4hfc",
  authDomain: "firstfirebase-ccf3a.firebaseapp.com",
  projectId: "firstfirebase-ccf3a",
  storageBucket: "firstfirebase-ccf3a.appspot.com",
  messagingSenderId: "279021550950",
  appId: "1:279021550950:web:64993b88a51f621d919ca7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app)
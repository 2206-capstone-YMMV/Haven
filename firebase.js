// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from 'firebase/firestore' 
import { getAuth } from 'firebase/auth'

// Your web app's Firebase configuration (our project)
const firebaseConfig = {
  apiKey: "AIzaSyBcgo0Y4tcWzyR2qcpJcfZHHBUQTVM4hfc",
  authDomain: "firstfirebase-ccf3a.firebaseapp.com",
  projectId: "firstfirebase-ccf3a",
  storageBucket: "firstfirebase-ccf3a.appspot.com",
  messagingSenderId: "279021550950",
  appId: "1:279021550950:web:64993b88a51f621d919ca7"
};

// Your web app's Firebase configuration (Max's firebase)
// const firebaseConfig = {
//   apiKey: "AIzaSyAK4mNvs6aZVP-5oTimoHKf1V26J5yMPKY",
//   authDomain: "practice-problem-359619.firebaseapp.com",
//   projectId: "practice-problem-359619",
//   storageBucket: "practice-problem-359619.appspot.com",
//   messagingSenderId: "889394972098",
//   appId: "1:889394972098:web:0f8078945026c8a6ca425b",
//   measurementId: "G-1117EQ38CM"
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app)
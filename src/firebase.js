import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "tweetx-12.firebaseapp.com",
  projectId: "tweetx-12",
  storageBucket: "tweetx-12.appspot.com",
  messagingSenderId: "728923307900",
  appId: "1:728923307900:web:3570d466b58948a0aa2ef9",
  measurementId: "G-X5DJ13WBE5",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore();

export { auth, db };

export default app;

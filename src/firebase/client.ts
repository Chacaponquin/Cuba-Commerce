import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyApfYA4wMH0VY24IPJlFG04Lydz9RVaNQM",
  authDomain: "cuba-commerce.firebaseapp.com",
  projectId: "cuba-commerce",
  storageBucket: "cuba-commerce.appspot.com",
  messagingSenderId: "509208181062",
  appId: "1:509208181062:web:4fa6ecd655f8e8d2d20d47",
  measurementId: "G-456X89C7KB",
};

const firebaseApp = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { auth, provider, db, storage };

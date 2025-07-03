
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCvoJNrJGi_ILPy-Ke2Z_9B7KQ1EsUhg8k",
  authDomain: "project-2-2c4e2.firebaseapp.com",
  projectId: "project-2-2c4e2",
  storageBucket: "project-2-2c4e2.firebasestorage.app",
  messagingSenderId: "35885518577",
  appId: "1:35885518577:web:35bfb01aecaccfa078a350"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;

import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAj-cfd3Eku9w-vP6CiSWfEYhSZ1M4x80Y",
    authDomain: "acutefilmmovies.firebaseapp.com",
    projectId: "acutefilmmovies",
    storageBucket: "acutefilmmovies.firebasestorage.app",
    messagingSenderId: "702201085699",
    appId: "1:702201085699:web:561142754e136f75def336",
    measurementId: "G-V46FVR3ZY6"
};

// Initialize Firebase
let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export { db };

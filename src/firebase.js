// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCwZVPTRTt6IsYo3aCO9DkTlYDFgSXpWuI",
    authDomain: "baby-food-tracker-9941b.firebaseapp.com",
    databaseURL: "https://baby-food-tracker-9941b-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "baby-food-tracker-9941b",
    storageBucket: "baby-food-tracker-9941b.firebasestorage.app",
    messagingSenderId: "640445172501",
    appId: "1:640445172501:web:249d4922c5a431e7da771c",
    measurementId: "G-YF2GGVP973"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyB8nNIWLBO6CrL1RFJjvErSuhn1SCTms-8",
    authDomain: "roomspacer-cbdad.firebaseapp.com",
    projectId: "roomspacer-cbdad",
    storageBucket: "roomspacer-cbdad.appspot.com",
    messagingSenderId: "624878552223",
    appId: "1:624878552223:web:a88f76a76824575c398eaa",
    measurementId: "G-7Z33FN0JP3"
};

// Ініціалізація Firebase
const app = initializeApp(firebaseConfig);

// Ініціалізація Firebase Auth та Google Provider
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
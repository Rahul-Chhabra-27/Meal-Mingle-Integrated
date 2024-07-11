import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDuFvMsfgdMGj0qC7llcT9uA6N_QEZWxMA",
    authDomain: "mealmingle-be700.firebaseapp.com",
    projectId: "mealmingle-be700",
    storageBucket: "mealmingle-be700.appspot.com",
    messagingSenderId: "613866810186",
    appId: "1:613866810186:web:fe8be5994c1ba53bed2fb3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
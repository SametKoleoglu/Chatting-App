import { getApps, getApp, initializeApp } from "firebase/app";
import { getAuth } from "./Firebase";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {

};

const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);

const firebaseAuth = getAuth(app);
const firestoreDB = getFirestore(app);

export { app, firebaseAuth, firestoreDB };

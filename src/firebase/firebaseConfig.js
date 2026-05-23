import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
	apiKey: "AIzaSyAOo1awSZiJGus82cqSl-anhAU69bgmTsw",
	authDomain: "rheinmetall-cloud.firebaseapp.com",
	projectId: "rheinmetall-cloud",
	storageBucket: "rheinmetall-cloud.firebasestorage.app",
	messagingSenderId: "798369374697",
	appId: "1:798369374697:web:ac47d328600a5e895d2b78",
	measurementId: "G-YG2F8R0QWB",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };

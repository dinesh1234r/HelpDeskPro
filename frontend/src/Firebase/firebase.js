import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBQv7LEOEX4F06D4-UF3DrGV6elAfq5zdo",
  authDomain: "dinesh-22aee.firebaseapp.com",
  projectId: "dinesh-22aee",
  storageBucket: "dinesh-22aee.appspot.com",
  messagingSenderId: "775179586091",
  appId: "1:775179586091:web:6658aef2fe9438912db86e",
  measurementId: "G-GXVCJWF5N8",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage, ref, uploadBytes, getDownloadURL };

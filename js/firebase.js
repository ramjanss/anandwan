import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBlgvkMir4RrLdb8m-YKKarDrJOYW1_crY",
  authDomain: "wandhali-smart-gp.firebaseapp.com",
  projectId: "wandhali-smart-gp",
  storageBucket: "wandhali-smart-gp.firebasestorage.app",
  messagingSenderId: "42035952607",
  appId: "1:42035952607:web:d847a2e0703b8c1c5ca26a"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

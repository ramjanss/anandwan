console.log("MAIN JS LOADED");

import { db } from "./firebase.js";
import { collection, getDocs } from 
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

async function testConnection(){
  try{
    await getDocs(collection(db,"test"));
    console.log("Firebase Connected Successfully");
  }catch(e){
    console.log("Firebase Error:",e);
  }
}

testConnection();

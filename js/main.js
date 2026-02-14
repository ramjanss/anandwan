import { db } from "./firebase.js";
import { collection, getDocs } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const noticeList = document.getElementById("noticeList");

async function loadNotices(){
  noticeList.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "notices"));

  querySnapshot.forEach((docSnap) => {
    const li = document.createElement("li");
    li.textContent = docSnap.data().title;
    noticeList.appendChild(li);
  });
}

loadNotices();

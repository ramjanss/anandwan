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

import { collection, getDocs } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const galleryContainer = document.getElementById("galleryContainer");

async function loadGallery(){
  if(!galleryContainer) return;

  galleryContainer.innerHTML = "";

  const snapshot = await getDocs(collection(db,"gallery"));

  snapshot.forEach(docSnap=>{
    const img = document.createElement("img");
    img.src = docSnap.data().imageUrl;
    galleryContainer.appendChild(img);
  });
}

loadGallery();

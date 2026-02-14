import { db } from "./firebase.js";
import { collection, getDocs } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// ================= LOAD STATS =================

async function loadStats(){

  const notices = await getDocs(collection(db,"notices"));
  const complaints = await getDocs(collection(db,"complaints"));

  document.getElementById("noticeCount").innerText = notices.size;
  document.getElementById("complaintCount").innerText = complaints.size;

  let resolved = 0;
  complaints.forEach(doc=>{
    if(doc.data().status === "Resolved") resolved++;
  });

  document.getElementById("resolvedCount").innerText = resolved;
}

loadStats();


// ================= LOAD NOTICES =================

const noticeContainer = document.getElementById("noticeContainer");

async function loadNotices(){

  const snapshot = await getDocs(collection(db,"notices"));

  snapshot.forEach(docSnap=>{
    const data = docSnap.data();

    const div = document.createElement("div");
    div.className = "notice-card";

    div.innerHTML = `
      <strong>${data.title}</strong><br>
      ${data.description || ""}
      ${data.fileUrl ? 
        `<br><a href="${data.fileUrl}" target="_blank" class="btn">Download PDF</a>`
        : ""
      }
    `;

    noticeContainer.appendChild(div);
  });
}

loadNotices();


// ================= LOAD GALLERY =================

const galleryContainer = document.getElementById("galleryContainer");

async function loadGallery(){

  const snapshot = await getDocs(collection(db,"gallery"));

  snapshot.forEach(docSnap=>{
    const img = document.createElement("img");
    img.src = docSnap.data().imageUrl;
    galleryContainer.appendChild(img);
  });
}

loadGallery();

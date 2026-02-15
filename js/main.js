import { db } from "./firebase.js";
import { collection, getDocs } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// ================= SAFE LOAD STATS =================

async function loadStats(){

  const noticeEl = document.getElementById("noticeCount");
  const complaintEl = document.getElementById("complaintCount");
  const resolvedEl = document.getElementById("resolvedCount");

  if(!noticeEl || !complaintEl || !resolvedEl) return;

  const notices = await getDocs(collection(db,"notices"));
  const complaints = await getDocs(collection(db,"complaints"));

  noticeEl.innerText = notices.size;
  complaintEl.innerText = complaints.size;

  let resolved = 0;
  complaints.forEach(doc=>{
    if(doc.data().status === "Resolved") resolved++;
  });

  resolvedEl.innerText = resolved;
}

loadStats();


// ================= SAFE LOAD NOTICES =================

async function loadNotices(){

  const noticeContainer = document.getElementById("noticeContainer");
  if(!noticeContainer) return;

  noticeContainer.innerHTML = "";

  const snapshot = await getDocs(collection(db,"notices"));

  snapshot.forEach(docSnap=>{

    const data = docSnap.data();
    const div = document.createElement("div");
    div.className = "notice-card";

    div.innerHTML = `
      <strong>${data.title}</strong>
      <br><br>
      ${data.description || ""}
      ${data.fileUrl ? 
        `<br><br><a href="${data.fileUrl}" target="_blank" class="btn btn-primary">Download PDF</a>`
        : ""
      }
    `;

    noticeContainer.appendChild(div);
  });
}

loadNotices();


// ================= SAFE LOAD GALLERY =================

async function loadGallery(){

  const galleryTrack = document.getElementById("galleryTrack");
  if(!galleryTrack) return;

  galleryTrack.innerHTML = "";

  const snapshot = await getDocs(collection(db,"gallery"));

  snapshot.forEach(docSnap=>{
    const img = document.createElement("img");
    img.src = docSnap.data().imageUrl;
    galleryTrack.appendChild(img);
  });

  // Duplicate for smooth infinite scroll
  galleryTrack.innerHTML += galleryTrack.innerHTML;
}

loadGallery();

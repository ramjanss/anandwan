// ================= IMPORTS =================
import { db } from "./firebase.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// ================= LOAD LIVE STATS =================
async function loadStats() {

  const noticeCountEl = document.getElementById("noticeCount");
  const complaintCountEl = document.getElementById("complaintCount");
  const resolvedCountEl = document.getElementById("resolvedCount");

  if (!noticeCountEl || !complaintCountEl || !resolvedCountEl) return;

  const noticesSnapshot = await getDocs(collection(db, "notices"));
  const complaintsSnapshot = await getDocs(collection(db, "complaints"));

  let resolved = 0;

  complaintsSnapshot.forEach(docSnap => {
    if (docSnap.data().status === "Resolved") {
      resolved++;
    }
  });

  noticeCountEl.textContent = noticesSnapshot.size;
  complaintCountEl.textContent = complaintsSnapshot.size;
  resolvedCountEl.textContent = resolved;
}


// ================= LOAD NOTICES =================
async function loadNotices() {

  const noticeList = document.getElementById("noticeList");
  if (!noticeList) return;

  noticeList.innerHTML = "";

  const snapshot = await getDocs(collection(db, "notices"));

  snapshot.forEach(docSnap => {

    const data = docSnap.data();

    const card = document.createElement("div");
    card.className = "notice-card";

    card.innerHTML = `
      <h3>${data.title} 
        <span style="color:red;font-size:12px;">NEW</span>
      </h3>
      <p>${data.description || ""}</p>
      ${data.fileUrl 
        ? `<a href="${data.fileUrl}" target="_blank">📄 Download</a>` 
        : ""}
    `;

    noticeList.appendChild(card);
  });
}


// ================= LOAD GALLERY =================
async function loadGallery() {

  const track = document.getElementById("galleryTrack");
  if (!track) return;

  track.innerHTML = "";

  const snapshot = await getDocs(collection(db, "gallery"));

  snapshot.forEach(docSnap => {

    const img = document.createElement("img");
    img.src = docSnap.data().imageUrl;
    img.alt = "Village Image";

    track.appendChild(img);
  });

  // duplicate for infinite scroll
  track.innerHTML += track.innerHTML;
}


// ================= INIT =================
loadStats();
loadNotices();
loadGallery();

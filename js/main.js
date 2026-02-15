import { db } from "./firebase.js";
import { collection, getDocs } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// ================= LOAD STATS =================

async function loadStats(){

  const noticesSnapshot = await getDocs(collection(db,"notices"));
  const complaintsSnapshot = await getDocs(collection(db,"complaints"));

  let totalComplaints = 0;
  let resolved = 0;

  complaintsSnapshot.forEach(docSnap => {
    totalComplaints++;
    if(docSnap.data().status === "Resolved") resolved++;
  });

  document.getElementById("noticeCount").innerText = noticesSnapshot.size;
  document.getElementById("complaintCount").innerText = totalComplaints;
  document.getElementById("resolvedCount").innerText = resolved;
}

loadStats();


// ================= LOAD NOTICES =================

async function loadNotices(){

  const container = document.getElementById("noticeList");
  if(!container) return;

  container.innerHTML = "";

  const snapshot = await getDocs(collection(db,"notices"));

  snapshot.forEach(docSnap => {

    const data = docSnap.data();

    const card = document.createElement("div");
    card.className = "notice-card";

    card.innerHTML = `
      <strong>${data.title}</strong><br>
      ${data.description || ""}
      ${data.fileUrl ? `<br><a href="${data.fileUrl}" target="_blank">📄 Download</a>` : ""}
    `;

    container.appendChild(card);
  });
}

loadNotices();


// ================= LOAD GALLERY =================

async function loadGallery(){

  const track = document.getElementById("galleryTrack");
  if(!track) return;

  track.innerHTML = "";

  const snapshot = await getDocs(collection(db,"gallery"));

  snapshot.forEach(docSnap => {

    const data = docSnap.data();

    const img = document.createElement("img");
    img.src = data.imageUrl;

    track.appendChild(img);
  });

  // Duplicate images for smooth infinite scroll
  track.innerHTML += track.innerHTML;
}

loadGallery();

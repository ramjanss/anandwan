import { db } from "./firebase.js";
import { collection, getDocs, query, orderBy, limit }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ================= COUNTER ANIMATION =================

function animateCounter(element, target){
  let start = 0;
  const duration = 1000;
  const increment = target / (duration / 16);

  function update(){
    start += increment;
    if(start >= target){
      element.textContent = target;
    } else {
      element.textContent = Math.floor(start);
      requestAnimationFrame(update);
    }
  }

  update();
}

// ================= LOAD LIVE STATS =================

async function loadStats(){

  const noticesSnapshot = await getDocs(collection(db,"notices"));
  const complaintsSnapshot = await getDocs(collection(db,"complaints"));

  let totalComplaints = 0;
  let resolved = 0;

  complaintsSnapshot.forEach(docSnap=>{
    totalComplaints++;
    if(docSnap.data().status === "Resolved") resolved++;
  });

  const noticeCount = document.getElementById("noticeCount");
  const complaintCount = document.getElementById("complaintCount");
  const resolvedCount = document.getElementById("resolvedCount");

  animateCounter(noticeCount, noticesSnapshot.size);
  animateCounter(complaintCount, totalComplaints);
  animateCounter(resolvedCount, resolved);
}

loadStats();


// ================= LOAD NOTICES (WITH NEW BADGE) =================

async function loadNotices(){

  const container = document.getElementById("noticeList");
  container.innerHTML = "";

  const q = query(
    collection(db,"notices"),
    orderBy("created","desc"),
    limit(6)
  );

  const snapshot = await getDocs(q);

  let index = 0;

  snapshot.forEach(docSnap=>{
    const data = docSnap.data();

    const card = document.createElement("div");
    card.className = "notice-card";

    const isNew = index < 2; // first 2 notices marked NEW
    index++;

    card.innerHTML = `
      <div class="notice-title">
        ${data.title}
        ${isNew ? '<span class="new-badge">NEW</span>' : ''}
      </div>

      <div class="notice-desc">
        ${data.description || ""}
      </div>

      ${data.fileUrl ? 
        `<a href="${data.fileUrl}" target="_blank" class="notice-btn">Download</a>`
        : ""}
    `;

    container.appendChild(card);
  });
}

loadNotices();


// ================= LOAD GALLERY =================

async function loadGallery(){

  const container = document.getElementById("galleryTrack");
  if(!container) return;

  container.innerHTML = "";

  const snapshot = await getDocs(collection(db,"gallery"));

  snapshot.forEach(docSnap=>{
    const img = document.createElement("img");
    img.src = docSnap.data().imageUrl;
    img.className = "gallery-img";
    container.appendChild(img);
  });

}

loadGallery();



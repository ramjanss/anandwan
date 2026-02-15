import { db } from "./firebase.js";
import { collection, getDocs, query, orderBy }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ================= COUNTER ================= */

function animateCounter(el, target){
  let start = 0;
  const increment = Math.ceil(target / 50);

  const timer = setInterval(()=>{
    start += increment;
    if(start >= target){
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = start;
    }
  },20);
}

/* ================= LOAD STATS ================= */

async function loadStats(){

  const notices = await getDocs(collection(db,"notices"));
  const complaints = await getDocs(collection(db,"complaints"));

  let total = 0;
  let resolved = 0;

  complaints.forEach(doc=>{
    total++;
    if(doc.data().status === "Resolved") resolved++;
  });

  animateCounter(document.getElementById("noticeCount"), notices.size);
  animateCounter(document.getElementById("complaintCount"), total);
  animateCounter(document.getElementById("resolvedCount"), resolved);
}

loadStats();

/* ================= LOAD NOTICES ================= */

async function loadNotices(){

  const container = document.getElementById("noticeList");
  container.innerHTML = "";

  const q = query(
    collection(db,"notices"),
    orderBy("created","desc")
  );

  const snapshot = await getDocs(q);

  let index = 0;

  snapshot.forEach(doc=>{
    const data = doc.data();

    const card = document.createElement("div");
    card.className = "notice-card";

    const isNew = index < 2;
    index++;

    card.innerHTML = `
      <strong>${data.title}</strong>
      ${isNew ? '<span class="new-badge">NEW</span>' : ''}
      <p>${data.description || ""}</p>
      ${data.fileUrl ? `<a href="${data.fileUrl}" target="_blank">Download</a>` : ""}
    `;

    container.appendChild(card);
  });
}

loadNotices();

/* ================= LOAD GALLERY ================= */

async function loadGallery(){

  const container = document.getElementById("galleryTrack");
  if(!container) return;

  container.innerHTML = "";

  const snapshot = await getDocs(collection(db,"gallery"));

  let images = [];

  snapshot.forEach(doc=>{
    images.push(doc.data().imageUrl);
  });

  // duplicate images for smooth infinite scroll
  const allImages = images.concat(images);

  allImages.forEach(url=>{
    const img = document.createElement("img");
    img.src = url;
    container.appendChild(img);
  });

}

loadGallery();

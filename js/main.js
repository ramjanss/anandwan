// ================= IMPORTS =================
import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// ================= FADE IN ANIMATION =================

document.addEventListener("DOMContentLoaded", () => {
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.8s ease";
  setTimeout(() => {
    document.body.style.opacity = "1";
  }, 100);
});


// ================= ANIMATED COUNTER =================

function animateCounter(element, target) {
  let start = 0;
  const duration = 800;
  const stepTime = Math.abs(Math.floor(duration / target));

  const timer = setInterval(() => {
    start += 1;
    element.textContent = start;
    if (start >= target) {
      clearInterval(timer);
      element.textContent = target;
    }
  }, stepTime);
}


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
    if (docSnap.data().status === "Resolved") resolved++;
  });

  animateCounter(noticeCountEl, noticesSnapshot.size);
  animateCounter(complaintCountEl, complaintsSnapshot.size);
  animateCounter(resolvedCountEl, resolved);
}


// ================= LOAD NOTICES =================

async function loadNotices() {

  const noticeList = document.getElementById("noticeList");
  if (!noticeList) return;

  noticeList.innerHTML = "";

  const q = query(
    collection(db, "notices"),
    orderBy("created", "desc")
  );

  const snapshot = await getDocs(q);

  let index = 0;

  snapshot.forEach(docSnap => {

    const data = docSnap.data();

    const card = document.createElement("div");
    card.className = "notice-card";

    card.style.transition = "transform 0.3s ease, box-shadow 0.3s ease";
    card.onmouseenter = () => {
      card.style.transform = "translateY(-6px)";
      card.style.boxShadow = "0 15px 35px rgba(0,0,0,0.1)";
    };
    card.onmouseleave = () => {
      card.style.transform = "translateY(0)";
      card.style.boxShadow = "0 6px 20px rgba(0,0,0,0.05)";
    };

    card.innerHTML = `
      <h3>
        ${data.title}
        ${index < 3 ? `<span style="
          background:#ff4757;
          color:white;
          font-size:11px;
          padding:4px 8px;
          border-radius:20px;
          margin-left:8px;
        ">NEW</span>` : ""}
      </h3>

      <p>${data.description || ""}</p>

      ${data.fileUrl ? `
        <a href="${data.fileUrl}" target="_blank"
        style="color:#0048ff;font-weight:600;text-decoration:none;">
          📄 Download PDF
        </a>` : ""}
    `;

    noticeList.appendChild(card);
    index++;
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

    img.style.transition = "transform 0.4s ease";

    img.onmouseenter = () => {
      img.style.transform = "scale(1.08)";
    };

    img.onmouseleave = () => {
      img.style.transform = "scale(1)";
    };

    track.appendChild(img);
  });

  // duplicate images for smooth infinite scroll
  track.innerHTML += track.innerHTML;
}


// ================= INIT =================

loadStats();
loadNotices();
loadGallery();

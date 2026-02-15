// ================= IMPORTS =================
import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// ================= FADE IN =================
document.addEventListener("DOMContentLoaded", () => {
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.8s ease";
  setTimeout(() => {
    document.body.style.opacity = "1";
  }, 100);
});


// ================= COUNTER =================
function animateCounter(element, target) {
  if (target === 0) {
    element.textContent = 0;
    return;
  }

  let start = 0;
  const duration = 800;
  const stepTime = Math.floor(duration / target);

  const timer = setInterval(() => {
    start++;
    element.textContent = start;
    if (start >= target) {
      clearInterval(timer);
      element.textContent = target;
    }
  }, stepTime);
}


// ================= LOAD STATS =================
async function loadStats() {
  const noticeCountEl = document.getElementById("noticeCount");
  const complaintCountEl = document.getElementById("complaintCount");
  const resolvedCountEl = document.getElementById("resolvedCount");

  if (!noticeCountEl) return;

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

  snapshot.forEach(docSnap => {
    const data = docSnap.data();

    const card = document.createElement("div");
    card.className = "notice-card";

    card.innerHTML = `
      <h3>${data.title}</h3>
      <p>${data.description || ""}</p>
      ${data.fileUrl ? `<a href="${data.fileUrl}" target="_blank">📄 Download</a>` : ""}
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
    track.appendChild(img);
  });

  track.innerHTML += track.innerHTML;
}


// ================= LOAD MEMBERS =================
async function loadMembers() {
  const container = document.getElementById("membersContainer");
  if (!container) return;

  container.innerHTML = "";

  const snapshot = await getDocs(collection(db, "members"));

  const members = [];

  snapshot.forEach(docSnap => {
    members.push(docSnap.data());
  });

  members.sort((a, b) => a.order - b.order);

  members.forEach(member => {
    const card = document.createElement("div");
    card.className = "member-card";

    card.innerHTML = `
      <img src="${member.photoUrl}" width="120" height="120" style="border-radius:50%;">
      <h3>${member.name}</h3>
      <p>${member.role}</p>
      <p>${member.phone}</p>
    `;

    container.appendChild(card);
  });
}


// ================= INIT =================
loadStats();
loadNotices();
loadGallery();
loadMembers();

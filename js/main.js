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

  const leaderContainer = document.getElementById("leadersContainer");
  const bodyContainer = document.getElementById("bodyMembersContainer");
  const employeeContainer = document.getElementById("employeesContainer");

  if (!leaderContainer) return;

  leaderContainer.innerHTML = "";
  bodyContainer.innerHTML = "";
  employeeContainer.innerHTML = "";

  const snapshot = await getDocs(collection(db, "members"));

  const leaders = [];
  const body = [];
  const employees = [];

  snapshot.forEach(docSnap => {
    const data = docSnap.data();

    if (data.type === "leader") leaders.push(data);
    else if (data.type === "body") body.push(data);
    else if (data.type === "employee") employees.push(data);
  });

  leaders.sort((a,b)=>a.order-b.order);
  body.sort((a,b)=>a.order-b.order);
  employees.sort((a,b)=>a.order-b.order);

  leaders.forEach(member => {
    leaderContainer.innerHTML += `
      <div class="leader-card">
        <img src="${member.photoUrl}">
        <h3>${member.name}</h3>
        <p>${member.role}</p>
        <span>${member.phone || ""}</span>
      </div>
    `;
  });

  body.forEach(member => {
    bodyContainer.innerHTML += `
      <div class="member-card">
        <img src="${member.photoUrl}">
        <h4>${member.name}</h4>
        <p>${member.role}</p>
      </div>
    `;
  });

  employees.forEach(member => {
    employeeContainer.innerHTML += `
      <div class="member-card">
        <img src="${member.photoUrl}">
        <h4>${member.name}</h4>
        <p>${member.role}</p>
      </div>
    `;
  });
}

loadMembers();

// ================= INIT =================
loadStats();
loadNotices();
loadGallery();
loadMembers();

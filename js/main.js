import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ================= LOADING STATE ================= */

function showLoading(container){
  container.innerHTML = `
    <div style="padding:40px;text-align:center;">
      <div style="
        width:40px;
        height:40px;
        border:4px solid #ccc;
        border-top:4px solid #1e3a8a;
        border-radius:50%;
        margin:auto;
        animation:spin 1s linear infinite;
      "></div>
    </div>
  `;
}

const style = document.createElement("style");
style.innerHTML = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.designation-badge{
  display:inline-block;
  background:#1e3a8a;
  color:white;
  font-size:12px;
  padding:4px 10px;
  border-radius:20px;
  margin-bottom:8px;
}
`;
document.head.appendChild(style);

/* ================= LOAD MEMBERS ================= */

async function loadMembers() {

  const leadersContainer = document.getElementById("leadersContainer");
  const bodyContainer = document.getElementById("bodyMembersContainer");
  const employeeContainer = document.getElementById("employeesContainer");

  if (!leadersContainer) return;

  showLoading(leadersContainer);
  showLoading(bodyContainer);
  showLoading(employeeContainer);

  const snapshot = await getDocs(collection(db, "members"));

  let members = [];

  snapshot.forEach(docSnap => {
    members.push(docSnap.data());
  });

  // ===== AUTO SORT =====
  members.sort((a,b)=>{
    return (a.order ?? 999) - (b.order ?? 999);
  });

  leadersContainer.innerHTML = "";
  bodyContainer.innerHTML = "";
  employeeContainer.innerHTML = "";

  let leaderCount = 0;
  let bodyCount = 0;
  let employeeCount = 0;

  members.forEach(member => {

    // ===== LEADER =====
    if (member.type === "leader") {

      leaderCount++;

      leadersContainer.innerHTML += `
        <div class="leader-card" style="position:relative;">
          <img src="${member.photoUrl}" alt="${member.name}">
          <div class="designation-badge">${member.role}</div>
          <h3>${member.name}</h3>
          ${member.phone ? `<p>📞 ${member.phone}</p>` : ""}
        </div>
      `;
    }

    // ===== BODY =====
    else if (member.type === "body") {

      bodyCount++;

      bodyContainer.innerHTML += `
        <div class="member-card">
          <img src="${member.photoUrl}" alt="${member.name}">
          <h4>${member.name}</h4>
          <p>${member.role}</p>
        </div>
      `;
    }

    // ===== EMPLOYEE =====
    else if (member.type === "employee") {

      employeeCount++;

      employeeContainer.innerHTML += `
        <div class="member-card">
          <img src="${member.photoUrl}" alt="${member.name}">
          <h4>${member.name}</h4>
          <p>${member.role}</p>
        </div>
      `;
    }

  });

  // ===== EMPTY STATES =====

  if(leaderCount === 0){
    leadersContainer.innerHTML = "<p>No leadership data available.</p>";
  }

  if(bodyCount === 0){
    bodyContainer.innerHTML = "<p>No body members available.</p>";
  }

  if(employeeCount === 0){
    employeeContainer.innerHTML = "<p>No employees available.</p>";
  }
}

/* ================= LOAD ANNOUNCEMENTS ================= */

async function loadAnnouncements() {

  const container = document.getElementById("announcementContainer");
  if (!container) return;

  showLoading(container);

  const snapshot = await getDocs(collection(db, "announcements"));

  container.innerHTML = "";

  if(snapshot.empty){
    container.innerHTML = "<p>No announcements available.</p>";
    return;
  }

  snapshot.forEach(docSnap => {

    const d = docSnap.data();

    container.innerHTML += `
      <div class="card">
        <h4>${d.title}</h4>
        <p>${d.description}</p>
      </div>
    `;
  });
}

/* ================= LOAD SCHEMES ================= */

async function loadSchemes() {

  const container = document.getElementById("schemesContainer");
  if (!container) return;

  showLoading(container);

  const snapshot = await getDocs(collection(db, "schemes"));

  container.innerHTML = "";

  if(snapshot.empty){
    container.innerHTML = "<p>No schemes available.</p>";
    return;
  }

  snapshot.forEach(docSnap => {

    const d = docSnap.data();

    container.innerHTML += `
      <div class="card">
        <h4>${d.title}</h4>
        <p>${d.description}</p>
      </div>
    `;
  });


/* ================= LOAD DASHBOARD ================= */

async function loadDashboard() {

  const container = document.getElementById("dashboardContainer");
  if (!container) return;

  showLoading(container);

  const snapshot = await getDocs(collection(db, "dashboard"));

  container.innerHTML = "";

  if(snapshot.empty){
    container.innerHTML = "<p>No statistics available.</p>";
    return;
  }

  snapshot.forEach(docSnap => {

    const d = docSnap.data();

    container.innerHTML += `
      <div class="dashboard-card">
        <h2>${d.value}</h2>
        <p>${d.label}</p>
      </div>
    `;
  });
}

/* ================= HERO SLIDER ================= */

function initHeroSlider(){

  const slides = document.querySelectorAll(".slide");
  let index = 0;

  setInterval(()=>{
    slides[index].classList.remove("active");
    index = (index + 1) % slides.length;
    slides[index].classList.add("active");
  },5000);

}

/* ================= HERO SLIDER ================= */
/* ================= HERO SLIDER FINAL ================= */

document.addEventListener("DOMContentLoaded", () => {

  const slides = document.querySelectorAll(".slide");
  const dotsContainer = document.querySelector(".dots");
  const leftArrow = document.querySelector(".arrow.left");
  const rightArrow = document.querySelector(".arrow.right");

  if(!slides.length) return;

  let index = 0;
  let interval;

  slides.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => showSlide(i));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll(".dot");

  function showSlide(i) {
    slides.forEach(s => s.classList.remove("active"));
    dots.forEach(d => d.classList.remove("active"));
    slides[i].classList.add("active");
    dots[i].classList.add("active");
    index = i;
  }

  function nextSlide() {
    index = (index + 1) % slides.length;
    showSlide(index);
  }

  function prevSlide() {
    index = (index - 1 + slides.length) % slides.length;
    showSlide(index);
  }

  function startAuto() {
    interval = setInterval(nextSlide, 5000);
  }

  function resetAuto() {
    clearInterval(interval);
    startAuto();
  }

  rightArrow.addEventListener("click", () => {
    prevSlide();
    resetAuto();
  });

  leftArrow.addEventListener("click", () => {
    nextSlide();
    resetAuto();
  });

  startAuto();

});
/* ================= INIT ================= */

loadMembers();
loadAnnouncements();
loadSchemes();
loadDashboard();
initHeroSlider();

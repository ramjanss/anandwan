import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ================= HERO SLIDER ================= */

async function loadSlides(){
  const container=document.getElementById("slidesContainer");
  const snapshot=await getDocs(collection(db,"slides"));

  snapshot.forEach(docSnap=>{
    const data=docSnap.data();
    container.innerHTML+=`
      <div class="slide" style="background-image:url('${data.imageUrl}')"></div>
    `;
  });

  const slides=document.querySelectorAll(".slide");
  let index=0;
  slides[0]?.classList.add("active");

  setInterval(()=>{
    slides[index].classList.remove("active");
    index=(index+1)%slides.length;
    slides[index].classList.add("active");
  },4000);
}

/* ================= ANNOUNCEMENTS ================= */

async function loadAnnouncements(){
  const container=document.getElementById("announcementContainer");
  const q=query(collection(db,"announcements"),orderBy("created","desc"));
  const snapshot=await getDocs(q);

  snapshot.forEach(docSnap=>{
    const d=docSnap.data();
    container.innerHTML+=`
      <div class="card">
        <h4>${d.title}</h4>
        <p>${d.description}</p>
      </div>
    `;
  });
}

/* ================= SCHEMES ================= */

async function loadSchemes(){
  const container=document.getElementById("schemesContainer");
  const snapshot=await getDocs(collection(db,"schemes"));

  snapshot.forEach(docSnap=>{
    const d=docSnap.data();
    container.innerHTML+=`
      <div class="card">
        <h4>${d.title}</h4>
        <p>${d.description}</p>
      </div>
    `;
  });
}

/* ================= DASHBOARD ================= */

async function loadDashboard(){
  const container=document.getElementById("dashboardContainer");
  const snapshot=await getDocs(collection(db,"dashboard"));

  snapshot.forEach(docSnap=>{
    const d=docSnap.data();
    container.innerHTML+=`
      <div class="dashboard-card">
        <h2>${d.value}</h2>
        <p>${d.label}</p>
      </div>
    `;
  });
}

/* ================= INIT ================= */

loadSlides();
loadAnnouncements();
loadSchemes();
loadDashboard();

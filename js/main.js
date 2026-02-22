import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
/* ================= LOAD MEMBERS ================= */

async function loadMembers() {

  const sarpanchBlock = document.getElementById("sarpanchBlock");
  const leadersContainer = document.getElementById("leadersContainer");
  const bodyContainer = document.getElementById("bodyMembersContainer");
  const employeeContainer = document.getElementById("employeesContainer");

  if (!sarpanchBlock) return;

  const snapshot = await getDocs(collection(db, "members"));

  let members = [];
  snapshot.forEach(docSnap => {
    members.push(docSnap.data());
  });

  members.sort((a,b)=>(a.order ?? 999)-(b.order ?? 999));

  sarpanchBlock.innerHTML="";
  leadersContainer.innerHTML="";
  bodyContainer.innerHTML="";
  employeeContainer.innerHTML="";

  members.forEach(member=>{

    // ✅ EXACT SARPANCH MATCH
    if(member.role && member.role.trim().toLowerCase() === "sarpanch"){

      sarpanchBlock.innerHTML = `
        <img src="${member.photoUrl}" alt="${member.name}">
        <div class="sarpanch-details">
          <span class="designation-label">Sarpanch</span>
          <h3>${member.name}</h3>
          ${member.phone ? `<p><strong>Contact:</strong> ${member.phone}</p>` : ""}
          <p>Serving the citizens of Wandhali with commitment, transparency and accountable governance.</p>
        </div>
      `;
    }

    // Secondary Leaders (Upsarpanch etc.)
    else if(member.type==="leader"){
      leadersContainer.innerHTML += `
        <div class="leader-card">
          <img src="${member.photoUrl}">
          <h4>${member.name}</h4>
          <p>${member.role}</p>
        </div>
      `;
    }

    else if(member.type==="body"){
      bodyContainer.innerHTML += `
        <div class="member-card">
          <img src="${member.photoUrl}">
          <h5>${member.name}</h5>
          <p>${member.role}</p>
        </div>
      `;
    }

    else if(member.type==="employee"){
      employeeContainer.innerHTML += `
        <div class="member-card">
          <img src="${member.photoUrl}">
          <h5>${member.name}</h5>
          <p>${member.role}</p>
        </div>
      `;
    }

  });

}

/* ================= SMART TRANSPARENCY DASHBOARD ================= */

async function loadDashboardStats(){

  const totalComplaintsEl = document.getElementById("totalComplaints");
  const resolvedComplaintsEl = document.getElementById("resolvedComplaints");
  const totalNoticesEl = document.getElementById("totalNotices");

  if(!totalComplaintsEl) return;

  try {

    // Fetch complaints
    const complaintSnap = await getDocs(collection(db, "complaints"));
    let totalComplaints = complaintSnap.size;

    let resolvedCount = 0;
    complaintSnap.forEach(doc=>{
      if(doc.data().status === "Resolved"){
        resolvedCount++;
      }
    });

    // Fetch notices
    const noticeSnap = await getDocs(collection(db, "notices"));
    let totalNotices = noticeSnap.size;

    animateNumber(totalComplaintsEl, totalComplaints);
    animateNumber(resolvedComplaintsEl, resolvedCount);
    animateNumber(totalNoticesEl, totalNotices);

  } catch(error){
    console.error("Dashboard Error:", error);
  }

}

/* ===== NUMBER ANIMATION ===== */

function animateNumber(element, target){

  let start = 0;
  const duration = 1000;
  const stepTime = Math.abs(Math.floor(duration / target));

  const timer = setInterval(()=>{

    start++;
    element.textContent = start;

    if(start >= target){
      clearInterval(timer);
      element.textContent = target;
    }

  }, stepTime || 50);


/* ================= LOAD LATEST NOTICES (STABLE VERSION) ================= */

async function loadLatestNotices(){

  const noticeList = document.getElementById("noticeList");
  if(!noticeList) return;

  noticeList.innerHTML = "Loading...";

  try {

    const snapshot = await getDocs(collection(db, "notices"));

    if(snapshot.empty){
      noticeList.innerHTML = "<p style='text-align:center;'>No notices available.</p>";
      return;
    }

    noticeList.innerHTML = "";

    let count = 0;

    snapshot.forEach(docSnap => {

      if(count >= 3) return;

      const n = docSnap.data();

      noticeList.innerHTML += `
        <div class="notice-item">
          <div class="notice-title">${n.title}</div>
          <div class="notice-date">
            ${n.created ? new Date(n.created.seconds * 1000).toLocaleDateString("en-IN") : ""}
          </div>
        </div>
      `;

      count++;

    });

  } catch(error){
    console.error("Notice Load Error:", error);
    noticeList.innerHTML = "<p style='text-align:center;'>Unable to load notices.</p>";
  }

}
  
}loadDashboardStats();
loadLatestNotices();

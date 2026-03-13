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
// ================= SMART TRANSPARENCY DASHBOARD =================

async function loadDashboardStats(){

  const totalComplaintsEl = document.getElementById("totalComplaints");
  const resolvedComplaintsEl = document.getElementById("resolvedComplaints");
  const pendingComplaintsEl = document.getElementById("pendingComplaints");
  const totalNoticesEl = document.getElementById("totalNotices");
  const resolutionRateEl = document.getElementById("resolutionRate");
  const monthlyComplaintsEl = document.getElementById("monthlyComplaints");
  const avgRatingEl = document.getElementById("avgRating");

  if(!totalComplaintsEl) return;

  try {

    const complaintSnap = await getDocs(collection(db, "complaints"));
    const noticeSnap = await getDocs(collection(db, "notices"));

    let totalComplaints = complaintSnap.size;
    let resolvedCount = 0;
    let pendingCount = 0;
    let monthlyCount = 0;
    let ratingTotal = 0;
    let ratingCount = 0;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    complaintSnap.forEach(doc => {

      const data = doc.data();
      const status = data.status;

      // Workflow Support
      if(status === "Resolved"){
        resolvedCount++;
      } else {
        pendingCount++;
      }

      // Monthly Count
      if(data.createdAt){
        const createdDate = data.createdAt.toDate();
        if(createdDate.getMonth() === currentMonth &&
           createdDate.getFullYear() === currentYear){
            monthlyCount++;
        }
      }

      // Average Rating
      if(data.rating){
        ratingTotal += Number(data.rating);
        ratingCount++;
      }

    });

    const totalNotices = noticeSnap.size;

    // Resolution Percentage
    const resolutionRate = totalComplaints > 0
      ? Math.round((resolvedCount / totalComplaints) * 100)
      : 0;

    // Average Rating
    const avgRating = ratingCount > 0
      ? (ratingTotal / ratingCount).toFixed(1)
      : 0;

    // Animate Numbers
    animateNumber(totalComplaintsEl, totalComplaints);
    animateNumber(resolvedComplaintsEl, resolvedCount);
    animateNumber(pendingComplaintsEl, pendingCount);
    animateNumber(totalNoticesEl, totalNotices);
    animateNumber(resolutionRateEl, resolutionRate);
    animateNumber(monthlyComplaintsEl, monthlyCount);

    avgRatingEl.textContent = avgRating;

  } catch(error){
    console.error("Dashboard Error:", error);
  }

}



// ================= SAFE NUMBER ANIMATION =================

function animateNumber(element, target){

  let start = 0;

  if(target === 0){
    element.textContent = 0;
    return;
  }

  const duration = 800;
  const stepTime = Math.max(Math.floor(duration / target), 20);

  const timer = setInterval(() => {

    start++;
    element.textContent = start;

    if(start >= target){
      clearInterval(timer);
      element.textContent = target;
    }

  }, stepTime);
}



// ================= LOAD ON PAGE =================

loadDashboardStats();
loadLatestNotices();

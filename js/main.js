import { db } from "./firebase.js";
import { collection, getDocs }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

    // ===== SARPANCH =====
    if(member.role?.toLowerCase().includes("sarpanch")){
      sarpanchBlock.innerHTML = `
        <img src="${member.photoUrl}" alt="${member.name}">
        <div class="sarpanch-details">
          <span class="designation-label">${member.role}</span>
          <h3>${member.name}</h3>
          ${member.phone ? `<p><strong>Contact:</strong> ${member.phone}</p>` : ""}
          <p>Serving the citizens of Wandhali with commitment, transparency, and accountable governance.</p>
        </div>
      `;
    }

    // ===== SECONDARY LEADERS =====
    else if(member.type==="leader"){
      leadersContainer.innerHTML += `
        <div class="leader-card">
          <img src="${member.photoUrl}" alt="${member.name}">
          <h4>${member.name}</h4>
          <p>${member.role}</p>
        </div>
      `;
    }

    // ===== BODY MEMBERS =====
    else if(member.type==="body"){
      bodyContainer.innerHTML += `
        <div class="member-card">
          <img src="${member.photoUrl}" alt="${member.name}">
          <h4>${member.name}</h4>
          <p>${member.role}</p>
        </div>
      `;
    }

    // ===== EMPLOYEES =====
    else if(member.type==="employee"){
      employeeContainer.innerHTML += `
        <div class="member-card">
          <img src="${member.photoUrl}" alt="${member.name}">
          <h4>${member.name}</h4>
          <p>${member.role}</p>
        </div>
      `;
    }

  });

}

/* ================= INIT ================= */

loadMembers();

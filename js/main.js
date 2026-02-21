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

loadMembers();

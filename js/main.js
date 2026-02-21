import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ================= LOAD MEMBERS ================= */

async function loadMembers() {

  const leadersContainer = document.getElementById("leadersContainer");
  const bodyContainer = document.getElementById("bodyMembersContainer");
  const employeeContainer = document.getElementById("employeesContainer");

  if (!leadersContainer) return;

  leadersContainer.innerHTML = "";
  bodyContainer.innerHTML = "";
  employeeContainer.innerHTML = "";

  const q = query(collection(db, "members"), orderBy("order"));
  const snapshot = await getDocs(q);

  snapshot.forEach(docSnap => {

    const member = docSnap.data();

    // ===== LEADER CARD =====
    if (member.type === "leader") {

      leadersContainer.innerHTML += `
        <div class="leader-card">
          <img src="${member.photoUrl}" alt="${member.name}">
          <h3>${member.name}</h3>
          <p><strong>${member.role}</strong></p>
          ${member.phone ? `<p>📞 ${member.phone}</p>` : ""}
        </div>
      `;
    }

    // ===== BODY MEMBER CARD =====
    else if (member.type === "body") {

      bodyContainer.innerHTML += `
        <div class="member-card">
          <img src="${member.photoUrl}" alt="${member.name}">
          <h4>${member.name}</h4>
          <p>${member.role}</p>
        </div>
      `;
    }

    // ===== EMPLOYEE CARD =====
    else if (member.type === "employee") {

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


/* ================= LOAD ANNOUNCEMENTS ================= */

async function loadAnnouncements() {

  const container = document.getElementById("announcementContainer");
  if (!container) return;

  container.innerHTML = "";

  const q = query(collection(db, "announcements"), orderBy("created", "desc"));
  const snapshot = await getDocs(q);

  snapshot.forEach(docSnap => {

    const data = docSnap.data();

    container.innerHTML += `
      <div class="card">
        <h4>${data.title}</h4>
        <p>${data.description}</p>
      </div>
    `;
  });
}


/* ================= LOAD SCHEMES ================= */

async function loadSchemes() {

  const container = document.getElementById("schemesContainer");
  if (!container) return;

  container.innerHTML = "";

  const snapshot = await getDocs(collection(db, "schemes"));

  snapshot.forEach(docSnap => {

    const data = docSnap.data();

    container.innerHTML += `
      <div class="card">
        <h4>${data.title}</h4>
        <p>${data.description}</p>
      </div>
    `;
  });
}


/* ================= LOAD DASHBOARD ================= */

async function loadDashboard() {

  const container = document.getElementById("dashboardContainer");
  if (!container) return;

  container.innerHTML = "";

  const snapshot = await getDocs(collection(db, "dashboard"));

  snapshot.forEach(docSnap => {

    const data = docSnap.data();

    container.innerHTML += `
      <div class="dashboard-card">
        <h2>${data.value}</h2>
        <p>${data.label}</p>
      </div>
    `;
  });
}


/* ================= INIT ================= */

loadMembers();
loadAnnouncements();
loadSchemes();
loadDashboard();

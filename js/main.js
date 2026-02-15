import { db } from "./firebase.js";
import { collection, getDocs, query, orderBy } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

async function loadPublicNotices(){

  const noticeList = document.getElementById("noticeList");
  if(!noticeList) return;

  noticeList.innerHTML = "<p style='color:white'>Loading...</p>";

  try{

    const q = query(
      collection(db,"notices"),
      orderBy("created","desc")
    );

    const snapshot = await getDocs(q);

    noticeList.innerHTML = "";

    if(snapshot.empty){
      noticeList.innerHTML = 
        "<p style='color:white'>No notices available.</p>";
      return;
    }

    snapshot.forEach(docSnap => {

      const data = docSnap.data();

      const card = document.createElement("div");
      card.className = "notice-card";

      card.innerHTML = `
        <div class="notice-title">${data.title || ""}</div>
        <div class="notice-desc">${data.description || ""}</div>
        ${
          data.fileUrl 
          ? `<a href="${data.fileUrl}" target="_blank" class="notice-btn">📄 Download</a>` 
          : ""
        }
      `;

      noticeList.appendChild(card);
    });

  }catch(error){
    console.error("Notice load error:", error);
    noticeList.innerHTML = 
      "<p style='color:white'>Error loading notices.</p>";
  }
}

loadPublicNotices();


// ================= SAFE LOAD NOTICES =================

async function loadNotices(){

  const noticeContainer = document.getElementById("noticeContainer");
  if(!noticeContainer) return;

  noticeContainer.innerHTML = "";

  const snapshot = await getDocs(collection(db,"notices"));

  snapshot.forEach(docSnap=>{

    const data = docSnap.data();
    const div = document.createElement("div");
    div.className = "notice-card";

    div.innerHTML = `
      <strong>${data.title}</strong>
      <br><br>
      ${data.description || ""}
      ${data.fileUrl ? 
        `<br><br><a href="${data.fileUrl}" target="_blank" class="btn btn-primary">Download PDF</a>`
        : ""
      }
    `;

    noticeContainer.appendChild(div);
  });
}

loadNotices();


// ================= SAFE LOAD GALLERY =================

async function loadGallery(){

  const galleryTrack = document.getElementById("galleryTrack");
  if(!galleryTrack) return;

  galleryTrack.innerHTML = "";

  const snapshot = await getDocs(collection(db,"gallery"));

  snapshot.forEach(docSnap=>{
    const img = document.createElement("img");
    img.src = docSnap.data().imageUrl;
    galleryTrack.appendChild(img);
  });

  // Duplicate for smooth infinite scroll
  galleryTrack.innerHTML += galleryTrack.innerHTML;
}

loadGallery();

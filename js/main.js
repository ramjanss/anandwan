import { db } from "./firebase.js";

import { 
  collection, 
  getDocs, 
  query, 
  orderBy 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// ======================
// LOAD PUBLIC NOTICES
// ======================

const noticeList = document.getElementById("noticeList");

async function loadPublicNotices(){

  if(!noticeList) return;

  noticeList.innerHTML = "";

  // Sort by newest first
  const q = query(
    collection(db,"notices"),
    orderBy("created","desc")
  );

  const snapshot = await getDocs(q);

  snapshot.forEach(docSnap => {

    const data = docSnap.data();

    const li = document.createElement("li");

    li.innerHTML = `
      <strong>${data.title}</strong><br>
      ${data.description ? `<p>${data.description}</p>` : ""}
      ${data.fileUrl ? 
        `<a href="${data.fileUrl}" target="_blank" class="btn">📄 Download PDF</a>` 
        : ""}
      <hr>
    `;

    noticeList.appendChild(li);
  });
}

loadPublicNotices();


// ======================
// LOAD GALLERY
// ======================

const galleryContainer = document.getElementById("galleryContainer");

async function loadGallery(){

  if(!galleryContainer) return;

  galleryContainer.innerHTML = "";

  const snapshot = await getDocs(collection(db,"gallery"));

  snapshot.forEach(docSnap => {

    const img = document.createElement("img");

    img.src = docSnap.data().imageUrl;
    img.style.width = "260px";
    img.style.height = "160px";
    img.style.objectFit = "cover";
    img.style.borderRadius = "12px";
    img.style.marginRight = "12px";

    galleryContainer.appendChild(img);
  });
}

loadGallery();

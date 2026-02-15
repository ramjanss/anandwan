// ================= IMPORTS =================
import { db } from "./firebase.js";

import { 
  collection,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// ================= LIVE STATS =================

const noticeCount = document.getElementById("noticeCount");
const complaintCount = document.getElementById("complaintCount");
const resolvedCount = document.getElementById("resolvedCount");

onSnapshot(collection(db,"notices"), (snapshot)=>{
  if(noticeCount){
    noticeCount.innerText = snapshot.size;
  }
});

onSnapshot(collection(db,"complaints"), (snapshot)=>{

  if(!complaintCount || !resolvedCount) return;

  let total = 0;
  let resolved = 0;

  snapshot.forEach(docSnap=>{
    total++;
    if(docSnap.data().status === "Resolved"){
      resolved++;
    }
  });

  complaintCount.innerText = total;
  resolvedCount.innerText = resolved;
});


// ================= LIVE NOTICES WITH SAFE NEW BADGE =================

const noticeList = document.getElementById("noticeList");

if (noticeList) {

  onSnapshot(collection(db, "notices"), (snapshot) => {

    noticeList.innerHTML = "";

    snapshot.forEach(docSnap => {

      const data = docSnap.data();

      // SAFELY handle Firestore Timestamp
      let createdDate;

      if (data.created && data.created.seconds) {
        createdDate = new Date(data.created.seconds * 1000);
      } else {
        createdDate = new Date();
      }

      const diffDays =
        (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24);

      const div = document.createElement("div");
      div.className = "notice-card";

      div.innerHTML = `
        <strong>
          ${data.title}
          ${diffDays <= 7
            ? `<span class="new-badge">NEW</span>`
            : ""}
        </strong>
        <br><br>
        ${data.description || ""}
        ${data.fileUrl
          ? `<br><br><a href="${data.fileUrl}" target="_blank">📄 Download</a>`
          : ""}
      `;

      noticeList.appendChild(div);

    });

  });

}


// ================= LIVE GALLERY =================

const galleryTrack = document.getElementById("galleryTrack");

if(galleryTrack){

  onSnapshot(collection(db,"gallery"), (snapshot)=>{

    galleryTrack.innerHTML = "";

    let images = [];

    snapshot.forEach(docSnap=>{
      images.push(docSnap.data().imageUrl);
    });

    const doubled = [...images, ...images];

    doubled.forEach(url=>{
      const img = document.createElement("img");
      img.src = url;
      galleryTrack.appendChild(img);
    });

  });

}

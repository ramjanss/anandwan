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


// ================= LIVE NOTICES WITH NEW BADGE =================

const noticeList = document.getElementById("noticeList");

if(noticeList){

  onSnapshot(collection(db,"notices"), (snapshot)=>{

    noticeList.innerHTML = "";

    snapshot.forEach(docSnap=>{

      const data = docSnap.data();
      const createdDate = data.created?.toDate ? data.created.toDate() : new Date(data.created);
      const daysOld = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24);

      const div = document.createElement("div");
      div.className = "notice-card";

      div.innerHTML = `
        <strong>
          ${data.title}
          ${daysOld <= 7 ? `<span style="color:white;background:red;padding:3px 8px;border-radius:12px;font-size:12px;margin-left:8px;">NEW</span>` : ""}
        </strong><br><br>
        ${data.description || ""}
        ${data.fileUrl ? `<br><br><a href="${data.fileUrl}" target="_blank">📄 Download</a>` : ""}
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

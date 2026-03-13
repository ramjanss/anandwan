import { db } from "../js/firebase.js";
import { collection, onSnapshot, query, orderBy, where }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let previousUnreadCount = 0;

const GP_ID = "anandwangp";

export function initAdminNotifications() {

  const badge = document.getElementById("sidebarUnreadBadge");
  const sound = new Audio("../assets/notification.mp3");

  const q = query(
    collection(db,"contactMessages"),
    where("gpid","==",GP_ID),
    orderBy("createdAt","desc")
  );

  onSnapshot(q, (snapshot)=>{

    let unreadCount = 0;

    snapshot.forEach(doc=>{
      if(doc.data().status === "unread"){
        unreadCount++;
      }
    });

    // Update badge
    if(badge){
      badge.textContent = unreadCount;
      badge.style.display = unreadCount > 0 ? "inline-block" : "none";
    }

    // Play sound if new unread message arrives
    if(unreadCount > previousUnreadCount){
      sound.play();
    }

    previousUnreadCount = unreadCount;

  });

}

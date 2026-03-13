import { db } from "../js/firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const GP_ID = "wandhali";

const storage = getStorage();

const form = document.getElementById("memberForm");
const membersList = document.getElementById("membersList");


// 🔥 ADD MEMBER
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const role = document.getElementById("role").value;
  const phone = document.getElementById("phone").value;
  const type = document.getElementById("type").value;
  const order = Number(document.getElementById("order").value);
  const photoFile = document.getElementById("photo").files[0];

  const storageRef = ref(storage, "members/" + Date.now() + "_" + photoFile.name);
  await uploadBytes(storageRef, photoFile);
  const photoUrl = await getDownloadURL(storageRef);

  await addDoc(collection(db, "members"), {
    name,
    role,
    phone,
    type,
    order,
    photoUrl,
    gpid: GP_ID
  });

  alert("Member Added Successfully!");
  form.reset();
  loadMembers();
});


// 🔥 LOAD MEMBERS
async function loadMembers() {
  membersList.innerHTML = "";

  import { where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const q = query(
  collection(db, "members"),
  where("gpid","==",GP_ID),
  orderBy("order")
);
  const snapshot = await getDocs(q);

  snapshot.forEach(docSnap => {
    const data = docSnap.data();

    const div = document.createElement("div");
    div.innerHTML = `
      <p>
        <strong>${data.name}</strong> - ${data.role}
        <button onclick="deleteMember('${docSnap.id}')">Delete</button>
      </p>
    `;

    membersList.appendChild(div);
  });
}


// 🔥 DELETE MEMBER
window.deleteMember = async function(id) {
  await deleteDoc(doc(db, "members", id));
  alert("Deleted!");
  loadMembers();
}

loadMembers();

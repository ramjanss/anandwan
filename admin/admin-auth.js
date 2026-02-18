import { auth } from "../js/firebase.js";
import { onAuthStateChanged, signOut } from 
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const allowedAdminEmail = "ramjansocial@gmail.com";

onAuthStateChanged(auth, (user)=>{
  if(!user){
    window.location.href = "../login.html";
    return;
  }

  if(user.email !== allowedAdminEmail){
    alert("Access Denied");
    window.location.href = "../index.html";
  }
});

<button onclick="logout()">Logout</button>

<script type="module">
import { auth } from "../js/firebase.js";
import { signOut } from 
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

window.logout = async () => {
  await signOut(auth);
  window.location.href = "../login.html";
};
</script>

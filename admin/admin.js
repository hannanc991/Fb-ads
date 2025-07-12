import { firebaseConfig } from '../firebaseConfig.js'; // go one level up
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
const app = initializeApp(firebaseConfig);
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

function loginAdmin() {
  const email = document.getElementById("admin-email").value;
  const password = document.getElementById("admin-password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      document.getElementById("login-section").style.display = "none";
      document.getElementById("dashboard").style.display = "block";
      loadServices();
    })
    .catch((error) => {
      document.getElementById("login-error").innerText = error.message;
    });
}

function addService() {
  const title = document.getElementById("service-title").value;
  const description = document.getElementById("service-description").value;
  const contact = document.getElementById("service-contact").value;
  const imageFile = document.getElementById("service-image").files[0];

  if (!title || !description || !contact || !imageFile) {
    alert("All fields are required.");
    return;
  }

  const storageRef = storage.ref(`services/${Date.now()}_${imageFile.name}`);
  storageRef.put(imageFile).then(snapshot => {
    snapshot.ref.getDownloadURL().then(imageURL => {
      db.collection("services").add({
        title,
        description,
        contact,
        imageURL
      }).then(() => {
        alert("Service added successfully!");
        loadServices();
      });
    });
  });
}

function loadServices() {
  const container = document.getElementById("admin-services-list");
  container.innerHTML = "";
  // After inserting the image tag:
const images = document.querySelectorAll('#services-list img');
images.forEach(img => {
  img.onerror = () => {
    img.style.display = 'none';  // Hide broken images gracefully
  };
});


  db.collection("services").get().then(snapshot => {
    snapshot.forEach(doc => {
      const data = doc.data();
      const div = document.createElement("div");
      div.className = "service-card";
      div.innerHTML = `
        <img src="${data.imageURL}" style="width:100px; height: 100px; object-fit: cover;"><br>
        <strong>${data.title}</strong><br>
        <p>${data.description}</p>
        <p><strong>Contact:</strong> ${data.contact}</p>
        <button onclick="deleteService('${doc.id}')">Delete</button>
        <hr>
      `;
      container.appendChild(div);
    });
  });
}

function deleteService(id) {
  db.collection("services").doc(id).delete().then(() => {
    alert("Service deleted");
    loadServices();
  });
}
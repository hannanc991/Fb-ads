import { firebaseConfig } from '../firebaseConfig.js'; // go one level up
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
const app = initializeApp(firebaseConfig);

const db = firebase.firestore();

const servicesList = document.getElementById("services-list");
const contactNumber = document.getElementById("contact-number");

db.collection("services").get().then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    const service = doc.data();
    servicesList.innerHTML += `
      <div class="service-card">
        <img src="${service.imageURL}" alt="${service.title}">
        <h3>${service.title}</h3>
        <p>${service.description}</p>
        <p><strong>Contact:</strong> ${service.contact}</p>
      </div>
    `;
  });
});

db.collection("siteSettings").doc("contact").get().then((doc) => {
  if (doc.exists) {
    contactNumber.textContent = doc.data().number;
  }
});


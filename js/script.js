// add lazy loading to images have data-src attribute
document.addEventListener("DOMContentLoaded", function() {
  // get all images have data-src attribute
  const images = document.querySelectorAll("img[data-src]");
  // check if browser support IntersectionObserver
  if ("IntersectionObserver" in window) {
    // create IntersectionObserver instance
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          observer.unobserve(img);
        }
      });
    });
    // observe all images
    images.forEach(img => {
      observer.observe(img);
    });
  } else {
    // if browser does not support IntersectionObserver
    images.forEach(img => {
      img.src = img.dataset.src;
    });
  }
});

// smooth scroll to anchor links
document.addEventListener("DOMContentLoaded", function() {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener("click", function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      target.scrollIntoView({
        behavior: "smooth"
      });
    });
  });
});

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXz2OUOrJ66a5wI2Y1TDEfaEPMkYxu8Uc",
  authDomain: "vietthang-thaovi-wedding.firebaseapp.com",
  projectId: "vietthang-thaovi-wedding",
  storageBucket: "vietthang-thaovi-wedding.appspot.com",
  messagingSenderId: "724246762373",
  appId: "1:724246762373:web:e3a0a5afd76b9e7962aaec",
  measurementId: "G-4BRJP4F7M2"
};

let listBless = [];

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Reference to the bless list collection
const blessListRef = db.collection("blessList");

// Create a new bless item
async function createBlessItem(data) {
  try {
    const docRef = await blessListRef.add(data);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

// Function to render bless items in real-time
async function watchAndRenderBlessItems() {
  blessListRef.onSnapshot((querySnapshot) => {
    const blessListContainer = document.getElementById('bless-list');
    blessListContainer.innerHTML = ''; // Clear existing items
    listBless = [];
    if (!querySnapshot.docs.length) {
      blessListContainer.innerHTML = `
      <div class="bless-item">
          Gửi lời chúc đầu tiên 🥰
      </div>
      `
      return;
    }
    // sort by createdAt
    querySnapshot = querySnapshot.docs.sort((a, b) => {
      return new Date(b.data().createdAt) - new Date(a.data().createdAt);
    });
    querySnapshot.forEach((doc) => {
      const blessItem = doc.data();
      listBless.push(blessItem);
      const blessItemDiv = document.createElement('div');
      blessItemDiv.classList.add('bless-item');
      blessItemDiv.innerHTML = `
        <div class="name">${blessItem.name}</div>
        <div>${blessItem.description}</div>
      `;
      blessListContainer.appendChild(blessItemDiv);
    });
  });
}

// Call watchAndRenderBlessItems to display the bless list in real-time on page load
document.addEventListener('DOMContentLoaded', watchAndRenderBlessItems);
// Handle form submission
document.getElementById('bless-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  e.stopPropagation();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const description = document.getElementById('description').value;
  if (!name || !description) {
    alert('Vui lòng nhập tất cả các field');
    return;
  }
  if (listBless.some(blessItem => (blessItem.name === name))) {
    alert(`Bạn (${name}) đã gửi lời chúc rồi`);
    return;
  }
  await createBlessItem({
    name,
    description,
    email,
    createdAt: new Date().toISOString()
  });

  // Clear form fields
  document.getElementById('name').value = '';
  document.getElementById('email').value = '';
  document.getElementById('description').value = '';
});
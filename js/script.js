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
    const MAX_LENGTH = 200;
    querySnapshot.forEach((doc) => {
      const blessItem = doc.data();
      listBless.push(blessItem);
      const blessItemDiv = document.createElement('div');
      blessItemDiv.classList.add('bless-item');
      const blessDescEl = document.createElement('div');
      blessDescEl.classList.add('bless-description');
      function readMore() {
        blessDescEl.innerHTML = `
          <span>${blessItem.description}</span>
          <span class="read-less">Thu gọn</span>
        `;
        blessDescEl.removeEventListener('click', readMore);
        blessDescEl.addEventListener('click', readLess);
      }
      function readLess() {
        blessDescEl.innerHTML = `
          <span>${blessItem.description.slice(0, MAX_LENGTH)}...</span>
          <span class="read-more">Xem thêm</span>
        `;
        blessDescEl.removeEventListener('click', readLess);
        blessDescEl.addEventListener('click', readMore);
      }
      if (blessItem.description.length > MAX_LENGTH) {
        readLess();
      } else {
        blessDescEl.innerHTML = `
          <span>${blessItem.description}</span>
        `;
      }
      blessItemDiv.innerHTML = `
        <div class="name">
          <span>${blessItem.name}</span>
          ${blessItem.isRegisterCar ? `<img src="/images/icon-car.svg" width="20" />` : ''}
        </div>
      `;
      blessItemDiv.appendChild(blessDescEl);
      blessListContainer.appendChild(blessItemDiv);
    });
  });
}

// Call watchAndRenderBlessItems to display the bless list in real-time on page load
document.addEventListener('DOMContentLoaded', watchAndRenderBlessItems);
document.getElementById('register-car').addEventListener('change', function() {
  if (this.checked) {
    document.getElementById('input-phone').style.display = 'block';
    document.getElementById('phone').setAttribute('required', 'required');
  } else {
    document.getElementById('input-phone').style.display = 'none';
    document.getElementById('phone').removeAttribute('required');
  }
});
// Handle form submission
document.getElementById('bless-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  e.stopPropagation();
  const name = document.getElementById('name').value;
  const description = document.getElementById('description').value;
  const isRegisterCar = document.getElementById('register-car').checked;
  const phone = document.getElementById('phone').value;
  if (isRegisterCar && !phone) {
    alert('Vui lòng nhập số điện thoại');
    return;
  }
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
    phone,
    isRegisterCar,
    createdAt: new Date().toISOString()
  });

  // hide form after submit and show success message
  document.getElementById('bless-form').style.display = 'none';
  document.getElementById('bless-form').reset();
  document.getElementById('success-message').style.display = 'block';
  // set session storage to prevent multiple submissions
  sessionStorage.setItem('blessed', 'true');
});

// Check if user has already submitted a bless
if (sessionStorage.getItem('blessed')) {
  document.getElementById('bless-form').style.display = 'none';
  document.getElementById('success-message').style.display = 'block';
}
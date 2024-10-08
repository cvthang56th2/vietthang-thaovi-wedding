// add lazy loading to images have data-src attribute
document.addEventListener("DOMContentLoaded", function() {
  // get all images have data-src attribute
  const images = document.querySelectorAll("img[data-src]");
  const els = document.querySelectorAll(".lazy-load-bg");
  // check if browser support IntersectionObserver
  if ("IntersectionObserver" in window) {
    // create IntersectionObserver instance
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains("lazy-load-bg")) {
            const bg = entry.target;
            bg.style.backgroundImage = `url(${bg.dataset.src})`;
            observer.unobserve(bg);
          } else {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.addEventListener("load", () => {
                img.removeAttribute("data-src");
              });
            }
            observer.unobserve(img);
          }
        }
      });
    });
    // observe all images
    images.forEach(img => {
      observer.observe(img);
    });
    els.forEach(el => {
      observer.observe(el);
    });
  } else {
    // if browser does not support IntersectionObserver
    images.forEach(img => {
      img.src = img.dataset.src;
    });
    els.forEach(el => {
      el.style.backgroundImage = `url(${el.dataset.src})`;
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

let listBless = [];

// Create a new bless item
async function createBlessItem(data) {
  try {
    const res = await fetch('https://gialai.online/wp-json/bless-crud/v1/bless/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      throw new Error('Failed to add document');
    }

    // hide form after submit and show success message
    document.getElementById('bless-form').style.display = 'none';
    document.getElementById('bless-form').reset();
    document.getElementById('success-message').style.display = 'block';
    // set session storage to prevent multiple submissions
    sessionStorage.setItem('blessed', 'true');
    getAndRenderBlessItems()
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

// Function to render bless items in real-time
async function getAndRenderBlessItems() {
  listBless = [];
  const res = await fetch('https://gialai.online/wp-json/bless-crud/v1/bless/')
  const data = await res.json();
  listBless = data;
  const blessListContainer = document.getElementById('bless-list');
  blessListContainer.innerHTML = ''; // Clear existing items
  if (!listBless.length) {
    blessListContainer.innerHTML = `
    <div class="bless-item">
        Gửi lời chúc đầu tiên 🥰
    </div>
    `
    return;
  }
  listBless = listBless.sort((a, b) => {
    return b.id - a.id;
  });
  const MAX_LENGTH = 200;
  listBless.forEach((blessItem) => {
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
        ${blessItem.isRegisterCar === "1" ? `<img src="https://cvthang56th2.github.io/vietthang-thaovi-wedding/images/icon-car.svg" width="20" />` : ''}
      </div>
    `;
    blessItemDiv.appendChild(blessDescEl);
    blessListContainer.appendChild(blessItemDiv);
  });
}

// Call getAndRenderBlessItems to display the bless list in real-time on page load
document.addEventListener('DOMContentLoaded', getAndRenderBlessItems);
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
  });
});

// Check if user has already submitted a bless
if (sessionStorage.getItem('blessed')) {
  document.getElementById('bless-form').style.display = 'none';
  document.getElementById('success-message').style.display = 'block';
}
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

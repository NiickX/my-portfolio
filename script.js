const backToTop = document.getElementById("backToTop");
let lastScrollY = window.scrollY;

window.addEventListener("scroll", () => {
  const currentScrollY = window.scrollY;

  if (currentScrollY > lastScrollY && currentScrollY > 0) {
    backToTop.classList.add("show");
  } else {
    backToTop.classList.remove("show");
  }

  lastScrollY = currentScrollY;
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const sections = document.querySelectorAll(
  "main > header[id], main > section[id]",
);

const navLinks = document.querySelectorAll("nav a");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === "#" + entry.target.id,
          );
        });
      }
    });
  },
  {
    rootMargin: "-50% 0px -50% 0px",
  },
);
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const galleryImages = document.querySelectorAll(".gallery-images img");

galleryImages.forEach((img) => {
  img.addEventListener("click", () => {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add("open");
  });
});

function closeLightbox() {
  lightbox.classList.remove("open");
}

lightbox.addEventListener("click", (e) => {
  if (e.target !== lightboxImg) closeLightbox();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});

sections.forEach((section) => observer.observe(section));

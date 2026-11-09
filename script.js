const backToTop = document.getElementById("backToTop");

if (backToTop) {
  let lastScrollY = window.scrollY;

  window.addEventListener(
    "scroll",
    () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 0) {
        backToTop.classList.add("show");
      } else if (currentScrollY < lastScrollY) {
        backToTop.classList.remove("show");
      }

      lastScrollY = currentScrollY;
    },
    { passive: true },
  );

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

const sections = document.querySelectorAll(
  "main > header[id], main > section[id]",
);
const navLinks = document.querySelectorAll(".nav-links a");

if (sections.length && navLinks.length && "IntersectionObserver" in window) {
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
    { rootMargin: "-50% 0px -50% 0px" },
  );

  sections.forEach((section) => observer.observe(section));
}

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const galleryImages = document.querySelectorAll(".gallery-images img");

if (lightbox && lightboxImg) {
  let lastFocused = null;

  function openLightbox(img) {
    lastFocused = img;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    document.getElementById("lightboxClose")?.focus();
  }

  function closeLightbox() {
    if (!lightbox.classList.contains("open")) return;
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    lastFocused?.focus();
  }

  galleryImages.forEach((img) => {
    img.tabIndex = 0;
    img.setAttribute("role", "button");

    img.addEventListener("click", () => openLightbox(img));
    img.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(img);
      }
    });
  });

  lightbox.addEventListener("click", (e) => {
    if (e.target !== lightboxImg) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });
}

const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    siteNav.classList.toggle("is-open", !isOpen);
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      menuToggle.setAttribute("aria-expanded", "false");
      siteNav.classList.remove("is-open");
    }
  });
}

const reducedMotionQuery = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);
const finePointerQuery = window.matchMedia(
  "(hover: hover) and (pointer: fine)",
);

if (finePointerQuery.matches && !reducedMotionQuery.matches) {
  document.querySelectorAll(".project-media").forEach((media) => {
    media.addEventListener("pointermove", (event) => {
      const bounds = media.getBoundingClientRect();
      const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
      const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;
      media.style.setProperty("--tilt-x", `${vertical * -5}deg`);
      media.style.setProperty("--tilt-y", `${horizontal * 5}deg`);
    });

    media.addEventListener("pointerleave", () => {
      media.style.removeProperty("--tilt-x");
      media.style.removeProperty("--tilt-y");
    });
  });
}

const depthBackground = document.querySelector(".depth-background");
const heroVisual = document.querySelector(".hero-visual");

if (depthBackground && !reducedMotionQuery.matches) {
  let pointerX = 0;
  let pointerY = 0;
  let ticking = false;

  const updateDepth = () => {
    const scrollRange =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = scrollRange > 0 ? window.scrollY / scrollRange : 0;

    depthBackground.style.setProperty("--pointer-x", `${pointerX}px`);
    depthBackground.style.setProperty("--pointer-y", `${pointerY}px`);
    depthBackground.style.setProperty(
      "--scroll-depth",
      `${scrollProgress * 120}px`,
    );
    heroVisual?.style.setProperty("--hero-tilt-x", `${-pointerY * 0.035}deg`);
    heroVisual?.style.setProperty("--hero-tilt-y", `${pointerX * 0.035}deg`);
    heroVisual?.style.setProperty("--code-shift-x", `${pointerX * 0.18}px`);
    heroVisual?.style.setProperty("--code-shift-y", `${pointerY * 0.16}px`);
    ticking = false;
  };

  const requestUpdate = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateDepth);
    }
  };

  if (finePointerQuery.matches) {
    window.addEventListener(
      "pointermove",
      (event) => {
        pointerX = (event.clientX / window.innerWidth - 0.5) * 38;
        pointerY = (event.clientY / window.innerHeight - 0.5) * 30;
        requestUpdate();
      },
      { passive: true },
    );
  }

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate, { passive: true });
  updateDepth();
}

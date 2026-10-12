const menuButton = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

if (menuButton && siteNav) {
  const closeMenu = () => {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    siteNav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  };

  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!open));
    menuButton.setAttribute("aria-label", open ? "Open navigation" : "Close navigation");
    siteNav.classList.toggle("is-open", !open);
    document.body.classList.toggle("menu-open", !open);
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target.closest("a") && window.matchMedia("(max-width: 700px)").matches) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

const currentPage = window.location.pathname.split("/").pop().toLowerCase() || "home.html";
document.querySelectorAll(".site-nav a[href]").forEach((link) => {
  if (link.getAttribute("href").split("#")[0].toLowerCase() === currentPage) {
    link.setAttribute("aria-current", "page");
  }
});

document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver((entries, activeObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        activeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((element) => observer.observe(element));
} else {
  revealItems.forEach((element) => element.classList.add("is-visible"));
}

const slides = [...document.querySelectorAll(".hero-slide")];
const dots = [...document.querySelectorAll(".slider-dot")];
if (slides.length > 1 && dots.length === slides.length) {
  let currentSlide = slides.findIndex((slide) => slide.classList.contains("is-active"));
  if (currentSlide < 0) currentSlide = 0;
  let timer;

  const showSlide = (nextIndex) => {
    currentSlide = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, index) => {
      const active = index === currentSlide;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
    });
    dots.forEach((dot, index) => dot.setAttribute("aria-pressed", String(index === currentSlide)));
  };

  const restartTimer = () => {
    window.clearInterval(timer);
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      timer = window.setInterval(() => showSlide(currentSlide + 1), 6500);
    }
  };
  document.querySelector("[data-slide='next']")?.addEventListener("click", () => { showSlide(currentSlide + 1); restartTimer(); });
  document.querySelector("[data-slide='previous']")?.addEventListener("click", () => { showSlide(currentSlide - 1); restartTimer(); });
  dots.forEach((dot, index) => dot.addEventListener("click", () => { showSlide(index); restartTimer(); }));
  document.querySelector(".hero-slider")?.addEventListener("mouseenter", () => window.clearInterval(timer));
  document.querySelector(".hero-slider")?.addEventListener("mouseleave", restartTimer);
  showSlide(currentSlide);
  restartTimer();
}

const galleryFilters = document.querySelectorAll("[data-gallery-filter]");
const galleryCards = document.querySelectorAll("[data-gallery-year]");
galleryFilters.forEach((filter) => {
  filter.addEventListener("click", () => {
    const year = filter.getAttribute("data-gallery-filter");
    galleryFilters.forEach((button) => button.setAttribute("aria-pressed", String(button === filter)));
    galleryCards.forEach((card) => {
      card.hidden = year !== "all" && card.getAttribute("data-gallery-year") !== year;
    });
  });
});

const lightbox = document.querySelector(".lightbox");
if (lightbox instanceof HTMLDialogElement) {
  const image = lightbox.querySelector("img");
  const caption = lightbox.querySelector("p");
  lightbox.querySelector(".lightbox-close")?.addEventListener("click", () => lightbox.close());
  document.querySelectorAll("[data-lightbox-image]").forEach((button) => {
    button.addEventListener("click", () => {
      const thumbnail = button.querySelector("img");
      const fullSrc = button.getAttribute("data-lightbox-image");
      if (!thumbnail || !fullSrc || !image || !caption) return;
      image.src = fullSrc;
      image.alt = thumbnail.alt;
      caption.textContent = button.getAttribute("data-caption") || thumbnail.alt;
      lightbox.showModal();
    });
  });
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) lightbox.close();
  });
  lightbox.addEventListener("close", () => image?.removeAttribute("src"));
}

const contactForm = document.querySelector("#contact-form");
if (contactForm instanceof HTMLFormElement) {
  const status = contactForm.querySelector(".form-status");
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    const data = new FormData(contactForm);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const subjectLine = String(data.get("subject") || "School enquiry").trim();
    const message = String(data.get("message") || "").trim();
    const subject = encodeURIComponent(`ABC High School: ${subjectLine}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    if (status) status.textContent = "Opening your email app with the message ready. Please review it and press send there.";
    window.location.href = `mailto:communications@abchighschool.org?subject=${subject}&body=${body}`;
  });
}

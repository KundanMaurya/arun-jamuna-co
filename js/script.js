/* =========================================================
   ARUN JAMUNA & CO. — script.js
   Vanilla JS only. No frameworks, no build step.
   ========================================================= */

/* ---------------------------------------------------------
   CONFIGURATION
   Update these values to configure the site. This is the
   ONLY place you should need to edit for these settings.
--------------------------------------------------------- */
const SITE_CONFIG = {
  WHATSAPP_NUMBER: "919833733433", // Replace with full number incl. country code, digits only
  WHATSAPP_DEFAULT_MESSAGE: "Hello Arun Jamuna & Co., I would like to book a consultation.",
  // Works out-of-the-box on GoDaddy shared/cPanel hosting, which supports PHP by
  // default — no third-party account or extra setup needed. Just set TO_EMAIL
  // inside contact-handler.php to your real inbox. See README.md for details,
  // and for the alternative (Formspree-style) endpoint option if your hosting
  // plan does not support PHP.
  FORM_ENDPOINT: "contact-handler.php"
};

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initStickyHeader();
  initNavigation();
  initActiveNav();
  initFAQ();
  initCounters();
  initScrollAnimations();
  initContactForm();
  initBackToTop();
  initWhatsApp();
  initYear();
});

/* ---------------------------------------------------------
   Theme toggle — light / dark mode

   The initial theme is already applied before this script runs
   (see the small inline script in each page's <head>, which reads
   localStorage or the system preference and sets data-theme on
   <html> before first paint, avoiding a flash of the wrong theme).
   This function just wires up the visible toggle buttons and keeps
   the saved preference, the header button and the mobile menu
   button all in sync.
--------------------------------------------------------- */
function initThemeToggle() {
  const root = document.documentElement;
  const desktopToggle = document.querySelector("#theme-toggle");
  const mobileToggle = document.querySelector("#mobile-theme-toggle");
  if (!desktopToggle && !mobileToggle) return;

  const getTheme = () => root.getAttribute("data-theme") === "dark" ? "dark" : "light";

  const updateControls = (theme) => {
    const isDark = theme === "dark";

    if (desktopToggle) {
      desktopToggle.setAttribute("aria-pressed", String(isDark));
      desktopToggle.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
    }
    if (mobileToggle) {
      mobileToggle.setAttribute("aria-pressed", String(isDark));
      const icon = mobileToggle.querySelector("i");
      const stateLabel = mobileToggle.querySelector("span:last-child");
      if (icon) {
        icon.classList.toggle("fa-moon", !isDark);
        icon.classList.toggle("fa-sun", isDark);
      }
      if (stateLabel) stateLabel.textContent = isDark ? "On" : "Off";
    }
  };

  const setTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {
      /* localStorage unavailable (e.g. private browsing) — theme still
         applies for the current page view, it just won't persist. */
    }
    updateControls(theme);
  };

  // Sync button state with whatever theme was already applied on load
  updateControls(getTheme());

  const toggleTheme = () => setTheme(getTheme() === "dark" ? "light" : "dark");

  desktopToggle && desktopToggle.addEventListener("click", toggleTheme);
  mobileToggle && mobileToggle.addEventListener("click", toggleTheme);
}

/* ---------------------------------------------------------
   Sticky header: shrink + shadow on scroll
--------------------------------------------------------- */
function initStickyHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const setState = () => {
    if (window.scrollY > 12) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  };

  setState();
  window.addEventListener("scroll", setState, { passive: true });
}

/* ---------------------------------------------------------
   Mobile navigation drawer
--------------------------------------------------------- */
function initNavigation() {
  const toggle = document.querySelector(".nav-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  if (!toggle || !mobileNav) return;

  const backdrop = mobileNav.querySelector(".mobile-nav-backdrop");
  const links = mobileNav.querySelectorAll("a");

  const openMenu = () => {
    mobileNav.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("nav-open");
  };

  const closeMenu = () => {
    mobileNav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  };

  toggle.addEventListener("click", () => {
    const isOpen = mobileNav.classList.contains("is-open");
    isOpen ? closeMenu() : openMenu();
  });

  backdrop && backdrop.addEventListener("click", closeMenu);
  links.forEach((link) => link.addEventListener("click", closeMenu));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
}

/* ---------------------------------------------------------
   Highlight active nav link based on current page
--------------------------------------------------------- */
function initActiveNav() {
  const current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-list a, .mobile-nav-list a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === current || (current === "" && href === "index.html")) {
      link.setAttribute("aria-current", "page");
    }
  });
}

/* ---------------------------------------------------------
   FAQ accordion
--------------------------------------------------------- */
function initFAQ() {
  const items = document.querySelectorAll(".faq-item");
  if (!items.length) return;

  items.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    if (!question || !answer) return;

    question.addEventListener("click", () => {
      const isOpen = item.getAttribute("data-open") === "true";

      // Close all others (single-open accordion behaviour)
      items.forEach((other) => {
        if (other !== item) {
          other.setAttribute("data-open", "false");
          other.querySelector(".faq-question").setAttribute("aria-expanded", "false");
          other.querySelector(".faq-answer").style.maxHeight = null;
        }
      });

      if (isOpen) {
        item.setAttribute("data-open", "false");
        question.setAttribute("aria-expanded", "false");
        answer.style.maxHeight = null;
      } else {
        item.setAttribute("data-open", "true");
        question.setAttribute("aria-expanded", "true");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });
}

/* ---------------------------------------------------------
   Animated counters (trust statistics)
--------------------------------------------------------- */
function initCounters() {
  const counters = document.querySelectorAll("[data-counter]");
  if (!counters.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const animateCounter = (el) => {
    const target = parseFloat(el.getAttribute("data-counter"));
    const suffix = el.getAttribute("data-suffix") || "";
    const duration = reduceMotion ? 0 : 1600;

    if (duration === 0) {
      el.textContent = target + suffix;
      return;
    }

    const startTime = performance.now();
    const startVal = 0;

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + (target - startVal) * eased);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

/* ---------------------------------------------------------
   Scroll reveal animations (fade-up)
--------------------------------------------------------- */
function initScrollAnimations() {
  const revealEls = document.querySelectorAll(".reveal");
  if (!revealEls.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach((el) => observer.observe(el));
}

/* ---------------------------------------------------------
   Contact form: client-side validation + real submission

   This site ships with contact-handler.php, a small PHP mail
   script that works automatically on GoDaddy shared/cPanel
   hosting (PHP is supported by default there — no extra setup,
   account, or API key required). The form below posts to it
   via fetch() for a smooth in-page success/error message, and
   falls back to a normal (non-JS) form submission + redirect
   if JavaScript is unavailable.

   If your hosting plan does not support PHP, replace
   SITE_CONFIG.FORM_ENDPOINT with a hosted form endpoint (e.g.
   a Formspree-style URL) instead — the fetch() call below works
   the same way either way, since it just POSTs form-data to
   whatever URL is configured.
--------------------------------------------------------- */
function initContactForm() {
  const form = document.querySelector("#contact-form");
  if (!form) return;

  const successBox = document.querySelector("#form-success");
  const errorBox = document.querySelector("#form-error");
  const submitBtn = document.querySelector("#form-submit-btn");

  // If the PHP handler redirected back with a status query param
  // (non-JS fallback path), show the right message on page load.
  const params = new URLSearchParams(window.location.search);
  if (params.get("status") === "success" && successBox) {
    successBox.classList.add("visible");
    successBox.scrollIntoView({ behavior: "smooth", block: "center" });
  } else if (params.get("status") === "error" && errorBox) {
    errorBox.classList.add("visible");
    errorBox.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  const validators = {
    fullName: (val) => val.trim().length >= 2,
    email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()),
    phone: (val) => /^[0-9+\-\s()]{10,15}$/.test(val.trim()),
    service: (val) => val.trim().length > 0,
    message: (val) => val.trim().length >= 15
  };

  const errorMessages = {
    fullName: "Please enter your full name.",
    email: "Please enter a valid email address.",
    phone: "Please enter a valid phone number (10-15 digits).",
    service: "Please select the service you require.",
    message: "Please provide at least 15 characters describing your enquiry."
  };

  const showError = (field, message) => {
    const group = field.closest(".form-group");
    if (!group) return;
    group.classList.add("has-error");
    const errorEl = group.querySelector(".field-error");
    if (errorEl) errorEl.textContent = message;
  };

  const clearError = (field) => {
    const group = field.closest(".form-group");
    if (!group) return;
    group.classList.remove("has-error");
  };

  const validateField = (field) => {
    const name = field.name;
    if (!validators[name]) return true;
    const valid = validators[name](field.value);
    if (valid) {
      clearError(field);
    } else {
      showError(field, errorMessages[name]);
    }
    return valid;
  };

  // Live validation on blur
  Object.keys(validators).forEach((name) => {
    const field = form.elements[name];
    if (field) {
      field.addEventListener("blur", () => validateField(field));
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Hide any previous result messages before a fresh attempt
    successBox && successBox.classList.remove("visible");
    errorBox && errorBox.classList.remove("visible");

    let isValid = true;
    Object.keys(validators).forEach((name) => {
      const field = form.elements[name];
      if (field && !validateField(field)) isValid = false;
    });

    if (!isValid) {
      const firstError = form.querySelector(".has-error");
      if (firstError) firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const endpoint = SITE_CONFIG.FORM_ENDPOINT;
    if (!endpoint || endpoint === "FORM_ENDPOINT_HERE") {
      // No endpoint configured at all — nothing to submit to.
      if (errorBox) {
        errorBox.textContent = "This form is not yet connected to an email/backend service. Please contact us by phone or WhatsApp instead.";
        errorBox.classList.add("visible");
        errorBox.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    form.classList.add("form-submitting");
    if (submitBtn) submitBtn.textContent = "Sending...";

    fetch(endpoint, {
      method: "POST",
      body: new FormData(form),
      headers: { "X-Requested-With": "XMLHttpRequest" }
    })
      .then((response) => {
        if (!response.ok) throw new Error("Request failed with status " + response.status);
        return response.json().catch(() => ({ success: true })); // tolerate non-JSON success responses
      })
      .then((data) => {
        if (data && data.success === false) throw new Error(data.message || "Submission failed");
        if (successBox) {
          successBox.classList.add("visible");
          successBox.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        form.reset();
      })
      .catch(() => {
        if (errorBox) {
          errorBox.classList.add("visible");
          errorBox.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      })
      .finally(() => {
        form.classList.remove("form-submitting");
        if (submitBtn) submitBtn.textContent = "Send Enquiry";
      });
  });
}

/* ---------------------------------------------------------
   Back to top button
--------------------------------------------------------- */
function initBackToTop() {
  const btn = document.querySelector(".back-to-top");
  if (!btn) return;

  const toggleVisibility = () => {
    if (window.scrollY > 480) {
      btn.classList.add("visible");
    } else {
      btn.classList.remove("visible");
    }
  };

  toggleVisibility();
  window.addEventListener("scroll", toggleVisibility, { passive: true });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ---------------------------------------------------------
   WhatsApp floating button — builds URL from SITE_CONFIG
--------------------------------------------------------- */
function initWhatsApp() {
  const links = document.querySelectorAll("[data-whatsapp-link]");
  if (!links.length) return;

  const number = SITE_CONFIG.WHATSAPP_NUMBER.replace(/[^0-9]/g, "");
  const message = encodeURIComponent(SITE_CONFIG.WHATSAPP_DEFAULT_MESSAGE);
  const url = `https://wa.me/${number}?text=${message}`;

  links.forEach((link) => {
    link.setAttribute("href", url);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
  });
}

/* ---------------------------------------------------------
   Auto-update footer copyright year
--------------------------------------------------------- */
function initYear() {
  const yearEls = document.querySelectorAll("[data-year]");
  const year = new Date().getFullYear();
  yearEls.forEach((el) => (el.textContent = year));
}

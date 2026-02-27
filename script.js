document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  const langToggle = document.getElementById("lang-toggle");
  const body = document.body;
  const scrollToTopBtn = document.getElementById("scrollToTop");
  const burgerBtn = document.querySelector(".burger-btn");
  const navMenu = document.querySelector(".nav");

  burgerBtn.addEventListener("click", () => {
    const isActive = burgerBtn.classList.toggle("active");
    navMenu.classList.toggle("active");
    burgerBtn.setAttribute("aria-expanded", isActive);
  });

  const navLinks = navMenu.querySelectorAll("a");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      burgerBtn.classList.remove("active");
      navMenu.classList.remove("active");
      burgerBtn.setAttribute("aria-expanded", false);
    });
  });

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      scrollToTopBtn.classList.add("show");
    } else {
      scrollToTopBtn.classList.remove("show");
    }
  });

  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  async function loadTranslations(lang) {
    try {
      const res = await fetch(`./locales/${lang}.json`);
      if (!res.ok) throw new Error(`Translation file for ${lang} not found`);
      return await res.json();
    } catch (err) {
      console.error("Translation error:", err);
      return {};
    }
  }

  async function applyTranslations(lang) {
    const translations = await loadTranslations(lang);
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const value = key
        .split(".")
        .reduce((obj, k) => (obj ? obj[k] : null), translations);
      if (value !== null && value !== undefined) {
        el.innerHTML = value;
      } else {
        console.warn(`Missing translation for "${key}" in "${lang}"`);
      }
    });

    if (langToggle) {
      langToggle.textContent = lang === "ua" ? "EN" : "UA";
    }

    localStorage.setItem("lang", lang);
  }

  const savedLang = localStorage.getItem("lang") || "ua";
  applyTranslations(savedLang);

  if (langToggle) {
    langToggle.addEventListener("click", () => {
      const newLang = document.documentElement.lang === "ua" ? "en" : "ua";
      applyTranslations(newLang);
    });
  }

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    body.classList.add("dark");
    if (themeToggle) {
      themeToggle.textContent = "🌞";
      themeToggle.setAttribute("aria-label", "Change to a light theme");
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      body.classList.toggle("dark");
      const isDark = body.classList.contains("dark");
      themeToggle.textContent = isDark ? "🌞" : "🌙";
      themeToggle.setAttribute(
        "aria-label",
        isDark ? "Change to a light theme" : "Change to a dark theme"
      );
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  }
});

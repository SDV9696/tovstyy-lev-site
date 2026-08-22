// Товстий Лев — мінімальний JS без фреймворків: мобільне меню, підсвітка активного
// пункту навігації під час скролу, легкий scroll-reveal, рік у футері.
// Свідомо НЕ визначає "відкрито/закрито зараз" — реальних годин роботи ще немає (див. README.md),
// а вигадати статус "відкрито" було б оманою для відвідувача.

document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("primaryNav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Active-nav highlight: makes it obvious which part of the page you're on —
  // requested explicitly (simple navigation). Purely additive, no effect if
  // IntersectionObserver isn't supported.
  if ("IntersectionObserver" in window && nav) {
    var navLinks = Array.prototype.slice.call(nav.querySelectorAll("a[href^='#']"));
    var sections = navLinks
      .map(function (link) { return document.querySelector(link.getAttribute("href")); })
      .filter(Boolean);

    var setActive = function (id) {
      navLinks.forEach(function (link) {
        link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
      });
    };

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach(function (section) { observer.observe(section); });
  }

  // Restrained scroll-reveal for section headings — respects reduced-motion via CSS.
  if ("IntersectionObserver" in window) {
    document.querySelectorAll("section h2, .usp-quote").forEach(function (el) {
      el.classList.add("reveal");
    });
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    document.querySelectorAll(".reveal").forEach(function (el) { revealObserver.observe(el); });
  }
});

/* ============================================================
   JOÃO VITOR ALVES RODRIGUES — SITE PROFISSIONAL
   Interações: menu, scrollspy, revelação, typewriter, contadores
   ============================================================ */
(function () {
  "use strict";

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Ano no rodapé ---------- */
  var ano = $("#ano");
  if (ano) ano.textContent = new Date().getFullYear();

  /* ---------- Barra de progresso + navbar + botão topo ---------- */
  var progressBar = $("#progress-bar");
  var navbar = $("#navbar");
  var toTop = $("#to-top");
  var ticking = false;

  function onScroll() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar) progressBar.style.width = (height > 0 ? (scrollTop / height) * 100 : 0) + "%";
    if (navbar) navbar.classList.toggle("scrolled", scrollTop > 24);
    if (toTop) toTop.classList.toggle("show", scrollTop > 640);
    ticking = false;
  }

  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ---------- Menu mobile ---------- */
  var hamburger = $("#hamburger");
  var navMenu = $("#nav-menu");

  function closeMenu() {
    if (!navMenu || !hamburger) return;
    navMenu.classList.remove("open");
    hamburger.classList.remove("active");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-label", "Abrir menu");
    document.body.style.overflow = "";
  }

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", function () {
      var isOpen = navMenu.classList.toggle("open");
      hamburger.classList.toggle("active", isOpen);
      hamburger.setAttribute("aria-expanded", String(isOpen));
      hamburger.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    $$("a", navMenu).forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 768) closeMenu();
    });
  }

  /* ---------- Revelação ao rolar ---------- */
  var revealElems = $$(".reveal");
  revealElems.forEach(function (el) {
    var delay = el.getAttribute("data-delay");
    if (delay) el.style.setProperty("--reveal-delay", delay + "ms");
  });

  if ("IntersectionObserver" in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -36px 0px" });
    revealElems.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealElems.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- Scrollspy (link ativo) ---------- */
  var sections = $$("main section[id]");
  var navLinks = $$(".nav-link");

  function setActiveLink(id) {
    navLinks.forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("href") === "#" + id);
    });
  }

  if ("IntersectionObserver" in window) {
    var spyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActiveLink(entry.target.id);
      });
    }, { rootMargin: "-42% 0px -52% 0px" });
    sections.forEach(function (sec) { spyObserver.observe(sec); });
  }

  /* ---------- Typewriter ---------- */
  var typeEl = $("#typewriter");
  var phrases = [
    "Profissional de TI",
    "Desenvolvedor de Software",
    "Tasy · Oracle 12g · SQL",
    "Suporte & Banco de Dados"
  ];

  if (typeEl) {
    if (reduceMotion) {
      typeEl.textContent = phrases[0];
    } else {
      var phraseIndex = 0, charIndex = 0, deleting = false;

      var tick = function () {
        var current = phrases[phraseIndex];
        var delay;

        if (!deleting) {
          typeEl.textContent = current.slice(0, ++charIndex);
          delay = 62;
          if (charIndex === current.length) { deleting = true; delay = 2100; }
        } else {
          typeEl.textContent = current.slice(0, --charIndex);
          delay = 30;
          if (charIndex === 0) {
            deleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            delay = 420;
          }
        }
        setTimeout(tick, delay);
      };
      setTimeout(tick, 500);
    }
  }

  /* ---------- Contadores ---------- */
  var counters = $$(".counter");

  function animateCounter(el) {
    var target = parseInt(el.getAttribute("data-target"), 10) || 0;
    var duration = 1400;
    var start = null;

    function stepFrame(now) {
      if (start === null) start = now;
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) window.requestAnimationFrame(stepFrame);
    }
    window.requestAnimationFrame(stepFrame);
  }

  if ("IntersectionObserver" in window && !reduceMotion) {
    counters.forEach(function (el) { el.textContent = "0"; });
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { counterObserver.observe(el); });
  } else {
    counters.forEach(function (el) {
      el.textContent = el.getAttribute("data-target");
    });
  }
})();

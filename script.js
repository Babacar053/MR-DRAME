
      // ─── Dark Mode ───
      (function () {
        const themeToggle = document.getElementById("theme-toggle");
        const themeToggleMobile = document.getElementById(
          "theme-toggle-mobile",
        );
        const themeIcon = document.getElementById("theme-icon");
        const themeIconMobile = document.getElementById("theme-icon-mobile");
        const html = document.documentElement;
        function setTheme(theme) {
          html.setAttribute("data-theme", theme);
          localStorage.setItem("theme", theme);
          const icon = theme === "dark" ? "fa-sun" : "fa-moon";
          themeIcon.className = "fas " + icon;
          themeIconMobile.className = "fas " + icon;
        }
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
          setTheme(savedTheme);
        } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          setTheme("dark");
        } else {
          setTheme("light");
        }
        themeToggle.addEventListener("click", () => {
          setTheme(
            html.getAttribute("data-theme") === "dark" ? "light" : "dark",
          );
        });
        themeToggleMobile.addEventListener("click", () => {
          setTheme(
            html.getAttribute("data-theme") === "dark" ? "light" : "dark",
          );
        });
      })();

      // ─── Menu mobile ───
      const menuBtn = document.getElementById("menu-btn");
      const mobileMenu = document.getElementById("mobile-menu");
      menuBtn.addEventListener("click", () =>
        mobileMenu.classList.toggle("hidden"),
      );
      document
        .querySelectorAll("#mobile-menu a")
        .forEach((link) =>
          link.addEventListener("click", () =>
            mobileMenu.classList.add("hidden"),
          ),
        );

      // ─── Animations scroll ───
      (function () {
        const fadeEls = document.querySelectorAll(".fade-up");
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.05, rootMargin: "0px 0px -20px 0px" },
        );
        fadeEls.forEach((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.classList.add("visible");
          } else {
            observer.observe(el);
          }
        });
      })();

      // ─── Scroll fluide ───
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
          const href = this.getAttribute("href");
          if (href === "#") return;
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            const navHeight = document.querySelector("nav").offsetHeight;
            window.scrollTo({
              top:
                target.getBoundingClientRect().top +
                window.pageYOffset -
                navHeight -
                20,
              behavior: "smooth",
            });
          }
        });
      });

      // ─── Navbar effet scroll ───
      window.addEventListener("scroll", () => {
        const nav = document.querySelector("nav");
        if (window.scrollY > 30) {
          nav.classList.add("shadow-md");
        } else {
          nav.classList.remove("shadow-md");
        }
      });

      // ─── Ripple ───
      document.querySelectorAll(".btn-ripple").forEach((btn) => {
        btn.addEventListener("click", function (e) {
          const rect = this.getBoundingClientRect();
          const ripple = document.createElement("span");
          ripple.classList.add("ripple");
          ripple.style.left = e.clientX - rect.left + "px";
          ripple.style.top = e.clientY - rect.top + "px";
          ripple.style.width = "20px";
          ripple.style.height = "20px";
          this.appendChild(ripple);
          setTimeout(() => ripple.remove(), 600);
        });
      });

      // ─── Hero Slider ───
      (function () {
        const slidesContainer = document.getElementById("hero-slides");
        const slides = slidesContainer.querySelectorAll(".hero-slide");
        const total = slides.length;
        let current = 0;
        let autoPlayInterval = null;
        let isTransitioning = false;
        const dotsContainer = document.getElementById("hero-dots");

        for (let i = 0; i < total; i++) {
          const dot = document.createElement("button");
          dot.classList.add("hero-dot");
          if (i === 0) dot.classList.add("active");
          dot.dataset.index = i;
          dot.addEventListener("click", () => {
            clearInterval(autoPlayInterval);
            goToSlide(i);
            startAutoPlay();
          });
          dotsContainer.appendChild(dot);
        }

        function goToSlide(index) {
          if (isTransitioning) return;
          if (index < 0) index = total - 1;
          if (index >= total) index = 0;
          isTransitioning = true;
          current = index;
          slidesContainer.style.transition =
            "transform 0.8s cubic-bezier(0.22,1,0.36,1)";
          slidesContainer.style.transform =
            "translateX(-" + current * 100 + "%)";
          document
            .querySelectorAll(".hero-dot")
            .forEach((dot, i) => dot.classList.toggle("active", i === current));
          setTimeout(() => {
            isTransitioning = false;
          }, 850);
        }

        document.getElementById("hero-prev").addEventListener("click", () => {
          clearInterval(autoPlayInterval);
          goToSlide(current - 1);
          startAutoPlay();
        });
        document.getElementById("hero-next").addEventListener("click", () => {
          clearInterval(autoPlayInterval);
          goToSlide(current + 1);
          startAutoPlay();
        });

        function startAutoPlay() {
          clearInterval(autoPlayInterval);
          autoPlayInterval = setInterval(() => goToSlide(current + 1), 5000);
        }
        startAutoPlay();

        const heroSection = document.querySelector(".hero-slider");
        heroSection.addEventListener("mouseenter", () =>
          clearInterval(autoPlayInterval),
        );
        heroSection.addEventListener("mouseleave", startAutoPlay);

        let touchStartX = 0;
        heroSection.addEventListener(
          "touchstart",
          (e) => {
            touchStartX = e.changedTouches[0].screenX;
          },
          { passive: true },
        );
        heroSection.addEventListener(
          "touchend",
          (e) => {
            const diff = touchStartX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 50) {
              clearInterval(autoPlayInterval);
              goToSlide(diff > 0 ? current + 1 : current - 1);
              startAutoPlay();
            }
          },
          { passive: true },
        );
      })();

      // ─── Carousel formateur ───
      (function () {
        const track = document.getElementById("carousel-track");
        const slides = track.querySelectorAll(".carousel-slide");
        const total = slides.length;
        let current = 0;
        let autoPlayInterval = null;
        const dotsContainer = document.getElementById("carousel-dots");

        for (let i = 0; i < total; i++) {
          const dot = document.createElement("button");
          dot.classList.add("carousel-dot");
          if (i === 0) dot.classList.add("active");
          dot.addEventListener("click", () => goToSlide(i));
          dotsContainer.appendChild(dot);
        }

        function goToSlide(index) {
          if (index < 0) index = total - 1;
          if (index >= total) index = 0;
          current = index;
          track.style.transform = "translateX(-" + current * 100 + "%)";
          document
            .querySelectorAll(".carousel-dot")
            .forEach((dot, i) => dot.classList.toggle("active", i === current));
        }

        document.getElementById("prev-btn").addEventListener("click", () => {
          clearInterval(autoPlayInterval);
          goToSlide(current - 1);
          startAutoPlay();
        });
        document.getElementById("next-btn").addEventListener("click", () => {
          clearInterval(autoPlayInterval);
          goToSlide(current + 1);
          startAutoPlay();
        });

        function startAutoPlay() {
          clearInterval(autoPlayInterval);
          autoPlayInterval = setInterval(() => goToSlide(current + 1), 5000);
        }
        startAutoPlay();

        const container = document.querySelector(".carousel-container");
        container.addEventListener("mouseenter", () =>
          clearInterval(autoPlayInterval),
        );
        container.addEventListener("mouseleave", startAutoPlay);

        let touchStartX = 0;
        container.addEventListener(
          "touchstart",
          (e) => {
            touchStartX = e.changedTouches[0].screenX;
          },
          { passive: true },
        );
        container.addEventListener(
          "touchend",
          (e) => {
            const diff = touchStartX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 50) {
              clearInterval(autoPlayInterval);
              goToSlide(diff > 0 ? current + 1 : current - 1);
              startAutoPlay();
            }
          },
          { passive: true },
        );
      })();

      // ─── Vidéos : une seule lecture ───
      (function () {
        const videos = document.querySelectorAll("#videos video");
        videos.forEach((video) => {
          video.addEventListener("play", function () {
            videos.forEach((other) => {
              if (other !== this && !other.paused) other.pause();
            });
          });
        });
      })();
// ─── Compteurs animés "Nos chiffres" ───
// ─── Compteurs animés "Nos chiffres" (version ultra-réactive) ───
(function() {
  'use strict';

  const counters = document.querySelectorAll('.counter');
  const progressBars = document.querySelectorAll('.progress-bar');
  let animationId = null;
  let isAnimating = false;

  function resetCounters() {
    counters.forEach((counter, index) => {
      counter.textContent = '0';
      if (progressBars[index]) {
        progressBars[index].style.width = '0%';
      }
    });
    isAnimating = false;
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  function animateCounters() {
    if (isAnimating) return;
    isAnimating = true;

    const duration = 2000;
    const startTime = performance.now();

    const targets = [];
    counters.forEach((counter, index) => {
      targets.push({
        el: counter,
        target: parseInt(counter.getAttribute('data-target'), 10),
        bar: progressBars[index],
        current: 0
      });
    });

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);

      targets.forEach((item) => {
        const value = Math.floor(ease * item.target);
        item.current = value;
        item.el.textContent = value.toLocaleString();
        const percent = (value / item.target) * 100;
        item.bar.style.width = Math.min(percent, 100) + '%';
      });

      if (progress < 1) {
        animationId = requestAnimationFrame(update);
      } else {
        targets.forEach((item) => {
          item.el.textContent = item.target.toLocaleString();
          item.bar.style.width = '100%';
        });
        isAnimating = false;
        animationId = null;
      }
    }

    animationId = requestAnimationFrame(update);
  }

  const chiffresSection = document.querySelector('#chiffres');
  if (chiffresSection) {
    let previousVisibility = false;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const isVisible = entry.isIntersecting;

        if (isVisible && !previousVisibility) {
          // La section devient visible → on lance l'animation
          resetCounters();
          setTimeout(() => animateCounters(), 50);
        } else if (!isVisible && previousVisibility) {
          // La section devient invisible → on réinitialise
          resetCounters();
        }

        previousVisibility = isVisible;
      });
    }, { threshold: 0.1 }); // Seuil bas pour une réactivité maximale

    observer.observe(chiffresSection);

    // Vérification au chargement
    if (chiffresSection.getBoundingClientRect().top < window.innerHeight) {
      previousVisibility = true;
      setTimeout(() => animateCounters(), 400);
    }
  }

})();
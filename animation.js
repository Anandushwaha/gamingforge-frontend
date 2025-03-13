// Revised Game Forge Animation System
// Focus on section transitions and glitch effect for title

document.addEventListener("DOMContentLoaded", () => {
  // Initialize all animation components
  initSectionTransitions();
  initGlitchEffect();
  initTabNavigationEffects();
  initCountdownTimer();
  initGalleryInteractions();

  // Apply drop shadow to hero character
  enhanceHeroCharacter();

  // Remove initial loading state if needed
  setTimeout(() => {
    document.body.classList.add("loaded");
  }, 300);
});

// ======= ENHANCE HERO CHARACTER =======
function enhanceHeroCharacter() {
  const heroCharacter = document.querySelector(".hero-character");
  if (heroCharacter) {
    // Apply drop shadow without animation
    heroCharacter.style.filter =
      "drop-shadow(0 0 15px rgba(0, 255, 255, 0.7)) drop-shadow(0 0 30px rgba(0, 100, 255, 0.5))";
    // Remove any existing transform or animation
    heroCharacter.style.transform = "none";
    heroCharacter.style.animation = "none";
    heroCharacter.style.transition = "none";
  }
}

// ======= GLITCH EFFECT FOR TITLE =======
function initGlitchEffect() {
  const title = document.querySelector("h1.title");
  const titleOutline = document.querySelector("h2.title-outline");

  if (title && titleOutline) {
    // Remove any existing animations
    title.style.animation = "none";
    title.style.transform = "none";
    title.style.transition = "none";

    titleOutline.style.animation = "none";
    titleOutline.style.transform = "none";
    titleOutline.style.transition = "none";

    // Add glitch effect class
    title.classList.add("glitch-text");
    titleOutline.classList.add("glitch-text-outline");

    // Generate glitch layers
    createGlitchLayers(title, "glitch-title");
    createGlitchLayers(titleOutline, "glitch-outline");
  }

  function createGlitchLayers(element, className) {
    // Create before and after pseudo-elements for glitch effect
    const content = element.textContent;
    const parent = element.parentElement;

    // Create data attributes for CSS to use
    element.setAttribute("data-text", content);

    // Add the main glitch class
    element.classList.add(className);
  }
}

// ======= SECTION TRANSITIONS =======
function initSectionTransitions() {
  // Elements that will animate on scroll
  const animatableElements = [
    ...document.querySelectorAll(
      ".section-title, .event-card, .activity-card, .gallery-item, .about-description, .about-footer, .vision-container, .objectives-container, .countdown-container, .contact-container"
    ),
  ];

  // Intersection Observer for scroll animations
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      // Add animation class when element comes into view
      if (entry.isIntersecting) {
        // Small delay for cascading effect
        setTimeout(() => {
          entry.target.classList.add("animate-in");

          // Unobserve after animation is triggered
          animationObserver.unobserve(entry.target);
        }, 150);
      }
    });
  }, observerOptions);

  // Start observing elements
  animatableElements.forEach((element) => {
    // Set initial state (hidden)
    element.classList.add("pre-animation");
    animationObserver.observe(element);
  });
}

// ======= TAB NAVIGATION EFFECTS =======
function initTabNavigationEffects() {
  const navItems = document.querySelectorAll(".nav-items li a");
  const sections = document.querySelectorAll("section");

  // Click handler for navigation tabs
  navItems.forEach((navItem) => {
    navItem.addEventListener("click", (e) => {
      e.preventDefault();

      // Get target section id from href
      const targetId = navItem.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        // Remove active state from all tabs
        navItems.forEach((item) => item.classList.remove("active"));

        // Add active state and glow effect to clicked tab
        navItem.classList.add("active");
        addRippleEffect(navItem, e);
        addGlowEffect(navItem);

        // Smooth scroll to section with easing
        scrollToSection(targetSection, 800);
      }
    });
  });

  // Highlight active tab based on scroll position
  window.addEventListener("scroll", () => {
    const scrollPosition = window.scrollY + window.innerHeight / 3;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        // Remove active class from all nav items
        navItems.forEach((item) => {
          item.classList.remove("active");
          item.classList.remove("glow-active");
        });

        // Find corresponding nav item and add active class
        const correspondingNavItem = document.querySelector(
          `.nav-items li a[href="#${sectionId}"]`
        );
        if (correspondingNavItem) {
          correspondingNavItem.classList.add("active");
          correspondingNavItem.classList.add("glow-active");
        }
      }
    });
  });

  // Helper function for ripple effect
  function addRippleEffect(element, event) {
    // Create ripple element
    const ripple = document.createElement("span");
    ripple.classList.add("ripple-effect");

    // Position ripple at click position
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    // Add to element and remove after animation
    element.appendChild(ripple);
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  // Helper function for glow effect on active tab
  function addGlowEffect(element) {
    // Remove glow from all tabs
    navItems.forEach((item) => item.classList.remove("glow-active"));

    // Add glow to active tab
    element.classList.add("glow-active");
  }

  // Helper function for smooth scrolling
  function scrollToSection(element, duration) {
    const targetPosition = element.offsetTop;
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      window.scrollTo(0, startPosition + distance * progress);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    }

    requestAnimationFrame(animation);
  }
}

// ======= COUNTDOWN TIMER =======
function initCountdownTimer() {
  // Set target date for next event (demo - 10 days from now)
  const now = new Date();
  const targetDate = new Date();
  targetDate.setDate(now.getDate() + 10);
  targetDate.setHours(16, 0, 0); // 4:00 PM

  // Update countdown every second
  const timerInterval = setInterval(updateCountdown, 1000);
  updateCountdown(); // Initial update

  function updateCountdown() {
    const currentTime = new Date();
    const difference = targetDate - currentTime;

    // If countdown is over, display zeros
    if (difference <= 0) {
      document.getElementById("days").textContent = "00";
      document.getElementById("hours").textContent = "00";
      document.getElementById("minutes").textContent = "00";
      document.getElementById("seconds").textContent = "00";
      clearInterval(timerInterval);
      return;
    }

    // Calculate remaining time
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    // Update display with animation
    updateCountdownElement("days", days);
    updateCountdownElement("hours", hours);
    updateCountdownElement("minutes", minutes);
    updateCountdownElement("seconds", seconds);
  }

  // Helper function to update countdown with flip animation
  function updateCountdownElement(id, value) {
    const element = document.getElementById(id);
    const currentValue = element.textContent;
    const newValue = value.toString().padStart(2, "0");

    // Only animate if value has changed
    if (currentValue !== newValue) {
      element.classList.add("flip");

      setTimeout(() => {
        element.textContent = newValue;
        element.classList.remove("flip");
      }, 300);
    }
  }
}

// ======= GALLERY INTERACTIONS =======
function initGalleryInteractions() {
  const galleryItems = document.querySelectorAll(".gallery-item");
  const lightbox = document.querySelector(".lightbox");
  const lightboxImage = document.querySelector(".lightbox-image");
  const lightboxCaption = document.querySelector(".lightbox-caption");
  const closeLightbox = document.querySelector(".close-lightbox");

  // Flip card effect on hover
  galleryItems.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      item.querySelector(".gallery-card").classList.add("flipped");
    });

    item.addEventListener("mouseleave", () => {
      item.querySelector(".gallery-card").classList.remove("flipped");
    });

    // Open lightbox on click
    item.addEventListener("click", () => {
      const imgSrc = item.querySelector("img").getAttribute("src");
      const caption = item.querySelector(".card-back h3").textContent;

      lightboxImage.setAttribute("src", imgSrc);
      lightboxCaption.textContent = caption;
      lightbox.classList.add("active");
    });
  });

  // Close lightbox
  closeLightbox.addEventListener("click", () => {
    lightbox.classList.remove("active");
  });

  // Close lightbox on outside click
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove("active");
    }
  });

  // Carousel functionality
  const carouselTrack = document.querySelector(".carousel-track");
  const carouselSlides = document.querySelectorAll(".carousel-slide");
  let currentIndex = 0;

  // Auto-advance carousel
  setInterval(() => {
    currentIndex = (currentIndex + 1) % carouselSlides.length;
    updateCarousel();
  }, 5000);

  function updateCarousel() {
    const offset = -currentIndex * 100;
    if (carouselTrack) {
      carouselTrack.style.transform = `translateX(${offset}%)`;
    }
  }
}

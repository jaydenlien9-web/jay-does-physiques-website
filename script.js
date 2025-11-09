// Year stamp
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile menu toggle
const toggle = document.getElementById('mobileToggle');
const nav = document.getElementById('nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.contains('active');
    nav.classList.toggle('active');
    toggle.setAttribute('aria-expanded', String(!isOpen));
  });

  // Close menu when clicking nav links
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Handle window resize
  const mq = window.matchMedia('(min-width: 860px)');
  const sync = () => {
    if (mq.matches) {
      nav.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    }
  };
  mq.addEventListener ? mq.addEventListener('change', sync) : mq.addListener(sync);
}

// Header scroll effect
const header = document.querySelector('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  lastScroll = currentScroll;
}, { passive: true });

// Hero parallax effect (motion-safe)
const heroBackground = document.getElementById('parallax');
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (heroBackground && !prefersReduced) {
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 6;
    const y = (e.clientY / window.innerHeight - 0.5) * 6;
    heroBackground.style.transform = `translate(${x}px, ${y}px)`;
  }, { passive: true });
}

// Animated counter for stats
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
}

// Trigger counter animation when stats come into view
const statNumbers = document.querySelectorAll('.stat-number[data-target]');
let statsAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !statsAnimated) {
      statsAnimated = true;
      statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        animateCounter(stat, target, 2000);
      });
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach(stat => {
  if (stat.hasAttribute('data-target')) {
    statsObserver.observe(stat);
  }
});

// Section reveal on scroll
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');

    // Skip if it's just "#" or onclick handler
    if (href === '#' || this.getAttribute('onclick')) {
      return;
    }

    e.preventDefault();
    const target = document.querySelector(href);

    if (target) {
      const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });

      // Close mobile menu if open
      if (nav.classList.contains('active')) {
        nav.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      }
    }
  });
});

// Add loading animation complete
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});

// FAQ Accordion
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
  question.addEventListener('click', () => {
    const item = question.parentElement;
    const isActive = item.classList.contains('active');

    // Close all other items
    faqQuestions.forEach(q => {
      const otherItem = q.parentElement;
      otherItem.classList.remove('active');
      q.setAttribute('aria-expanded', 'false');
    });

    // Toggle current item
    if (!isActive) {
      item.classList.add('active');
      question.setAttribute('aria-expanded', 'true');
    }
  });
});

// Exit Intent - Show subtle CTA when user is about to leave
let exitIntentShown = false;
const exitIntentDelay = 5000; // Only show after 5 seconds on site
let timeOnSite = 0;

setTimeout(() => { timeOnSite = Date.now(); }, 100);

document.addEventListener('mouseleave', (e) => {
  // Only trigger if mouse leaves from top of page (indicates closing tab/window)
  if (e.clientY < 10 && !exitIntentShown && timeOnSite && (Date.now() - timeOnSite > exitIntentDelay)) {
    const isContactPage = window.location.pathname.includes('contact');
    if (!isContactPage && !sessionStorage.getItem('exitIntentShown')) {
      showExitIntent();
      exitIntentShown = true;
      sessionStorage.setItem('exitIntentShown', 'true');
    }
  }
});

function showExitIntent() {
  const overlay = document.createElement('div');
  overlay.id = 'exitIntent';
  overlay.innerHTML = `
    <div class="exit-intent-overlay">
      <div class="exit-intent-modal">
        <button class="exit-intent-close" aria-label="Close">&times;</button>
        <h3>Before you go...</h3>
        <p>Free consultation. No pressure. Just honest conversation about your fitness goals.</p>
        <div class="exit-intent-ctas">
          <a href="/get-started.html" class="btn btn-primary">Get started</a>
          <a href="tel:0482010549" class="btn btn-secondary">Call: 0482 010 549</a>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  // Close on overlay click or close button
  overlay.querySelector('.exit-intent-overlay').addEventListener('click', (e) => {
    if (e.target.classList.contains('exit-intent-overlay')) {
      overlay.remove();
    }
  });
  overlay.querySelector('.exit-intent-close').addEventListener('click', () => {
    overlay.remove();
  });
}

// Sticky Mobile Contact Bar - Shows after scrolling
const stickyBar = document.createElement('div');
stickyBar.id = 'stickyContactBar';
stickyBar.className = 'sticky-contact-bar';
stickyBar.innerHTML = `
  <a href="tel:0482010549" class="sticky-contact-btn">
    <i class="fas fa-phone"></i>
    <span>Call Now</span>
  </a>
  <a href="/get-started.html" class="sticky-contact-btn sticky-contact-btn-primary">
    <i class="fas fa-rocket"></i>
    <span>Get Started</span>
  </a>
`;

// Only show on mobile and after scrolling
if (window.innerWidth < 768) {
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 600) {
      if (!document.getElementById('stickyContactBar')) {
        document.body.appendChild(stickyBar);
      }
    } else {
      const bar = document.getElementById('stickyContactBar');
      if (bar) bar.remove();
    }
  }, { passive: true });
}

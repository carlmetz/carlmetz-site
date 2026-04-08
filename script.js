// ============================================
// HEADER SCROLL
// ============================================
const header = document.getElementById('header');
function handleScroll() {
  if (window.scrollY > 20) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll();

// ============================================
// MOBILE NAV TOGGLE
// ============================================
const navToggle = document.querySelector('.nav-toggle');
const navMobile = document.querySelector('.nav-mobile');
if (navToggle && navMobile) {
  navToggle.addEventListener('click', () => {
    navMobile.classList.toggle('open');
  });
  navMobile.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navMobile.classList.remove('open'));
  });
}

// ============================================
// FADE-IN AU SCROLL
// ============================================
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

reveals.forEach(el => observer.observe(el));

// ============================================
// FAQ ACCORDION
// ============================================
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
  const btn = item.querySelector('.faq-q');
  const icon = item.querySelector('.faq-icon');
  btn.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    // Close all
    faqItems.forEach(i => {
      i.classList.remove('open');
      const ic = i.querySelector('.faq-icon');
      if (ic) ic.textContent = '+';
    });
    // Open clicked if it was closed
    if (!isOpen) {
      item.classList.add('open');
      icon.textContent = '−';
    }
  });
});

// ============================================
// FORMULAIRE LEAD MAGNET
// ============================================
const leadForm = document.getElementById('lead-form');
if (leadForm) {
  leadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(leadForm);
    const firstname = (data.get('firstname') || '').toString().trim();
    const email = (data.get('email') || '').toString().trim();
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!firstname || !emailValid) {
      [...leadForm.querySelectorAll('input')].forEach(input => {
        if (!input.value.trim() || (input.type === 'email' && !emailValid)) {
          input.style.borderColor = '#ef4444';
          setTimeout(() => { input.style.borderColor = ''; }, 2000);
        }
      });
      return;
    }

    const success = document.createElement('div');
    success.className = 'form-success';
    success.textContent = '✓ Votre catalogue arrive dans votre boîte mail !';
    leadForm.replaceWith(success);
  });
}

// ============================================
// CONTACT FORM (chips + validation)
// ============================================
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  const desc = contactForm.querySelector('#cf-desc');
  contactForm.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      desc.value = chip.dataset.text || chip.textContent;
      desc.focus();
    });
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const fields = contactForm.querySelectorAll('input[required], textarea[required]');
    let ok = true;
    fields.forEach(f => {
      const val = f.value.trim();
      const valid = val && (f.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val));
      if (!valid) {
        ok = false;
        f.style.borderColor = '#ef4444';
        setTimeout(() => { f.style.borderColor = ''; }, 2000);
      }
    });
    if (!ok) return;

    const success = document.createElement('div');
    success.className = 'form-success';
    success.textContent = '✓ Merci ! Votre demande a bien été envoyée. Je vous recontacte sous 24h.';
    contactForm.replaceWith(success);
  });
}

// ============================================
// SMOOTH SCROLL (fallback for older browsers)
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#' || href.length < 2) return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

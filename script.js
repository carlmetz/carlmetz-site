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
// FORM HELPERS (UTMs + device)
// ============================================
function getUTMs() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
    utm_term: params.get('utm_term') || '',
    utm_content: params.get('utm_content') || ''
  };
}
function getDeviceType() {
  const w = window.innerWidth;
  if (w <= 767) return 'mobile';
  if (w <= 1024) return 'tablette';
  return 'desktop';
}

// Retourne le chemin racine du site (ex: "/" ou "/carlmetz-site/")
// Fonctionne depuis la home (/) ou depuis une sous-page (/slug/)
function getSiteBase() {
  const path = window.location.pathname;
  const m = path.match(/^(.*?)\/(accompagnement-crm|agents-ia|apport-affaires|merci)(\/|$)/);
  if (m) return m[1] + '/';
  return path.replace(/\/[^\/]*$/, '/') || '/';
}

// ============================================
// FORMULAIRE CATALOGUE AGENTS IA
// ============================================
const catalogueForm = document.getElementById('catalogue-form');
if (catalogueForm) {
  catalogueForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const fields = catalogueForm.querySelectorAll('input[required]');
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

    const submitBtn = catalogueForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Envoi en cours...';
    }

    const utms = getUTMs();
    const payload = {
      form: 'catalogue-agents-ia',
      nom: catalogueForm.querySelector('[name="nom"]').value.trim(),
      email: catalogueForm.querySelector('[name="email"]').value.trim(),
      telephone: catalogueForm.querySelector('[name="telephone"]').value.trim(),
      page: window.location.pathname,
      device: getDeviceType(),
      utm_source: utms.utm_source,
      utm_medium: utms.utm_medium,
      utm_campaign: utms.utm_campaign,
      utm_term: utms.utm_term,
      utm_content: utms.utm_content,
      timestamp: new Date().toISOString()
    };

    const showSuccess = () => {
      if (!submitBtn) return;
      submitBtn.classList.add('btn-sent');
      submitBtn.innerHTML = '<span class="btn-check">✓</span> Catalogue envoyé';
      submitBtn.disabled = true;
    };

    fetch('https://hook.eu2.make.com/s1y8limio4espkvnnwkdankkrtp4j15k', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(showSuccess)
    .catch(showSuccess);
  });
}

// Contact form is now handled by components/loader.js

// ============================================
// APPORT D'AFFAIRES FORM
// ============================================
const apportForm = document.getElementById('apport-form');
if (apportForm) {
  apportForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const fields = apportForm.querySelectorAll('input[required], textarea[required]');
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

    const submitBtn = apportForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Envoi en cours...';
    }

    const utms = getUTMs();
    const payload = {
      form: 'apport-affaires',
      nom: apportForm.querySelector('#ap-nom').value.trim(),
      email: apportForm.querySelector('#ap-email').value.trim(),
      telephone: apportForm.querySelector('#ap-tel').value.trim(),
      entreprise: apportForm.querySelector('#ap-entreprise').value.trim(),
      contact_personne: apportForm.querySelector('#ap-contact').value.trim(),
      description: apportForm.querySelector('#ap-desc').value.trim(),
      page: window.location.pathname,
      device: getDeviceType(),
      utm_source: utms.utm_source,
      utm_medium: utms.utm_medium,
      utm_campaign: utms.utm_campaign,
      utm_term: utms.utm_term,
      utm_content: utms.utm_content,
      timestamp: new Date().toISOString()
    };

    fetch('https://hook.eu2.make.com/algltvivh3u7br1nbrfubdmn2lm73oj3', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(() => { window.location.href = getSiteBase() + 'merci/'; })
    .catch(() => { window.location.href = getSiteBase() + 'merci/'; });
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

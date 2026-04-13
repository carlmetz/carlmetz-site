/**
 * Component Loader
 * Injects reusable HTML components into placeholders.
 *
 * Usage:
 *   Full section:  <div data-component="contact-section"></div>
 *   Form only:     <div data-component="contact-form"></div>
 */
(function () {

  var contactFormHTML = '<form id="contact-form" class="contact-form" novalidate>' +
    '<div class="form-row">' +
      '<div class="field">' +
        '<label for="cf-nom">Nom <span class="req">*</span></label>' +
        '<input type="text" id="cf-nom" name="nom" placeholder="Votre nom" required>' +
      '</div>' +
      '<div class="field">' +
        '<label for="cf-prenom">Pr\u00e9nom <span class="req">*</span></label>' +
        '<input type="text" id="cf-prenom" name="prenom" placeholder="Votre pr\u00e9nom" required>' +
      '</div>' +
    '</div>' +
    '<div class="form-row">' +
      '<div class="field">' +
        '<label for="cf-email">Email <span class="req">*</span></label>' +
        '<input type="email" id="cf-email" name="email" placeholder="votre@email.fr" required>' +
      '</div>' +
      '<div class="field">' +
        '<label for="cf-tel">Num\u00e9ro de t\u00e9l\u00e9phone <span class="req">*</span></label>' +
        '<input type="tel" id="cf-tel" name="telephone" placeholder="+33 6 12 34 56 78" required>' +
      '</div>' +
    '</div>' +
    '<div class="field">' +
      '<label for="cf-entreprise">Entreprise</label>' +
      '<input type="text" id="cf-entreprise" name="entreprise" placeholder="Nom de votre entreprise">' +
    '</div>' +
    '<div class="field">' +
      '<label for="cf-desc">Description de votre projet <span class="req">*</span></label>' +
      '<div class="textarea-wrap">' +
        '<div class="textarea-chips" id="textareaChips">' +
          '<button type="button" class="chip" data-text="Je souhaiterais mettre en place HubSpot pour mon entreprise">Je souhaiterais mettre en place HubSpot pour mon entreprise</button>' +
          '<button type="button" class="chip" data-text="J\'ai un compte HubSpot, je souhaiterais l\'optimiser et le structurer">J\'ai un compte HubSpot, je souhaiterais l\'optimiser et le structurer</button>' +
          '<button type="button" class="chip" data-text="Je souhaiterais automatiser certains process internes de mon entreprise">Je souhaiterais automatiser certains process internes</button>' +
        '</div>' +
        '<textarea id="cf-desc" name="description" rows="5" placeholder="" required></textarea>' +
      '</div>' +
    '</div>' +
    '<button type="submit" class="btn btn-primary btn-lg btn-block">Envoyer ma demande \u2192</button>' +
  '</form>';

  var contactSectionHTML = '<section id="contact" class="section section-alt reveal" style="padding-top: 130px;">' +
    '<div class="container narrow center">' +
      '<h2 class="final-title">Parlons de votre projet</h2>' +
      '<p class="lede">D\u00e9crivez votre besoin en quelques lignes. Je vous r\u00e9ponds sous 24h avec une premi\u00e8re analyse.</p>' +
      contactFormHTML +
      '<div class="reassurance">' +
        '<span><span class="green-dot">\u25cf</span> Sans engagement</span>' +
        '<span><span class="green-dot">\u25cf</span> R\u00e9ponse sous 24h</span>' +
        '<span><span class="green-dot">\u25cf</span> Disponible maintenant</span>' +
      '</div>' +
    '</div>' +
  '</section>';

  var templates = {
    'contact-form': contactFormHTML,
    'contact-section': contactSectionHTML
  };

  // Inject components
  var placeholders = document.querySelectorAll('[data-component]');
  placeholders.forEach(function (el) {
    var name = el.dataset.component;
    if (templates[name]) {
      el.outerHTML = templates[name];
    }
  });

  // Bind form events
  var contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  var desc = contactForm.querySelector('#cf-desc');
  var chipsWrap = document.getElementById('textareaChips');

  if (chipsWrap && desc) {
    contactForm.querySelectorAll('.chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        desc.value = chip.dataset.text || chip.textContent;
        chipsWrap.classList.add('hidden');
        desc.focus();
      });
    });

    desc.addEventListener('input', function () {
      if (desc.value.trim() === '') {
        chipsWrap.classList.remove('hidden');
      } else {
        chipsWrap.classList.add('hidden');
      }
    });

    desc.addEventListener('focus', function () {
      if (desc.value.trim() !== '') {
        chipsWrap.classList.add('hidden');
      }
    });
  }

  // UTM helper
  function getUTMs() {
    var params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get('utm_source') || '',
      utm_medium: params.get('utm_medium') || '',
      utm_campaign: params.get('utm_campaign') || '',
      utm_term: params.get('utm_term') || '',
      utm_content: params.get('utm_content') || ''
    };
  }

  // Device type
  function getDeviceType() {
    var w = window.innerWidth;
    if (w <= 767) return 'mobile';
    if (w <= 1024) return 'tablette';
    return 'desktop';
  }

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var fields = contactForm.querySelectorAll('input[required], textarea[required]');
    var ok = true;
    fields.forEach(function (f) {
      var val = f.value.trim();
      var valid = val && (f.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val));
      if (!valid) {
        ok = false;
        f.style.borderColor = '#ef4444';
        setTimeout(function () { f.style.borderColor = ''; }, 2000);
      }
    });
    if (!ok) return;

    // Disable button
    var submitBtn = contactForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Envoi en cours...';
    }

    var utms = getUTMs();
    var payload = {
      nom: contactForm.querySelector('#cf-nom').value.trim(),
      prenom: contactForm.querySelector('#cf-prenom').value.trim(),
      email: contactForm.querySelector('#cf-email').value.trim(),
      telephone: contactForm.querySelector('#cf-tel').value.trim(),
      entreprise: contactForm.querySelector('#cf-entreprise').value.trim(),
      description: contactForm.querySelector('#cf-desc').value.trim(),
      page: window.location.pathname,
      device: getDeviceType(),
      utm_source: utms.utm_source,
      utm_medium: utms.utm_medium,
      utm_campaign: utms.utm_campaign,
      utm_term: utms.utm_term,
      utm_content: utms.utm_content,
      timestamp: new Date().toISOString()
    };

    fetch('https://hook.eu2.make.com/eniercavl9bkj6a6wk2r9nt4v1bv2dl7', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(function () {
      window.location.href = 'merci.html';
    })
    .catch(function () {
      window.location.href = 'merci.html';
    });
  });

  // Re-observe reveal for dynamically injected section
  var revealEls = document.querySelectorAll('.reveal:not(.visible)');
  if (revealEls.length) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { obs.observe(el); });
  }

})();
